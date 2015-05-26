import rethinkdb as rdb
from rethinkdb.errors import RqlRuntimeError


class MoreThanOneResult(Exception):
    pass


class QueryCollection(object):

    def __init__(self, query_model, filter=None):
        self.model = query_model
        self.query = self.model._table()
        if filter is not None:
            self.filter(filter)

    def filter(self, filter):
        self.query = self.query.filter(filter)
        return self

    def fetch(self):
        results = self.query.run()
        return [
            self.model(**props) for props in results
        ]

    def get(self):
        results = self.fetch()
        if len(results) == 0:
            return None
        if len(results) > 1:
            raise MoreThanOneResult
        return results[0]

    def update(self, **kwargs):
        return self.query.update(kwargs).run()

    def insert(self, **kwargs):
        return self.query.insert(kwargs).run()


class QueryModel(object):

    class Meta:
        table_name = ""

    _record = {}

    def __init__(self, *args, **kwargs):
        self._record = {}
        self._record.update(kwargs)

    def __getattr__(self, name):
        print 'get', name, self._record
        return self._record[name]

    def __setattr__(self, name, value):
        print 'set', name, value
        if name.startswith('_'):
            self.__dict__[name] = value
        else:
            self._record[name] = value
        print self._record

    @classmethod
    def _create(self):
        try:
            rdb.table_create(self.Meta.table_name).run()
        except RqlRuntimeError:
            return False
        else:
            return True

    @classmethod
    def _table(cls):
        try:
            rdb.table(cls.Meta.table_name).run()
        except RqlRuntimeError:
            cls._create()
        return rdb.table(cls.Meta.table_name)

    @classmethod
    def query(cls, filter=None):
        return QueryCollection(cls, filter)

    @classmethod
    def get(cls, id):
        record = cls._table().get(id).run()
        if record is not None:
            return cls(**dict(record))

    @classmethod
    def create(cls, **kwargs):
        model = cls(**kwargs)
        model.save()
        return model

    def save(self):
        if self.id is not None:
            record = self.query({'id': self.id}).get()
            if record is not None:
                return self.query({'id': self.id}).update(**self._record)

        self.query().insert(**self._record)
