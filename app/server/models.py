from . import orm


class Quiz(orm.QueryModel):
    class Meta(orm.QueryModel.Meta):
        table_name = 'quizzes'


class Question(orm.QueryModel):
    class Meta(orm.QueryModel.Meta):
        table_name = 'questions'


class Player(orm.QueryModel):
    class Meta(orm.QueryModel.Meta):
        table_name = 'players'
