// TypeOrm 中 如何模拟类继承

type List<T> = Array<T>;

type Repository<T> = {
  getList(): List<T>;
} & T

type User = {
  name: string;
  age: string;
  id: string;
}

type UserRepo = Repository<User>

const a = {} as UserRepo;

function Father(table:string) {
  this.__table__ = ""
}

function Son(table: string) {
  
}

