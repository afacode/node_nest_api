# mysql

DDL DML DQL DCL

```sql
SHOW DATABASES;

SELECT DATABASE();

CREATE DATABASE IF NOT EXISTS `afadcode_test`; 

USE `afadcode_test`;

DROP DATABASE IF EXISTS `afadcode_test`;

SHOW TABLES;

DESC users;

CREATE TABLE `users` (
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `nick_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `head_pic` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '电话',
  `is_frozen` tinyint NOT NULL DEFAULT '0' COMMENT '是否冻结',
  `is_admin` tinyint NOT NULL DEFAULT '0' COMMENT '是否管理员',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci


SHOW CREATE TABLE users;
```

### [数据类型](https://www.runoob.com/mysql/mysql-data-types.html)

### insert update delete

```sql
INSERT INTO table_name ( field1, field2,...fieldN )
                       VALUES
                       ( value1, value2,...valueN ),
                       ( value1, value2,...valueN );
                       
                       
UPDATE table_name SET field1=new-value1, field2=new-value2
[WHERE Clause]

DELETE FROM table_name [WHERE Clause]
```

### select

```sql

# 聚合函数
SELECT COUNT(name) FROM emp;

SELECT AVG(age) FROM emp;

SELECT MAX(age) FROM emp;

SELECT MIN(age) FROM emp;

SELECT SUM(age) from emp;



# 分组 group by
# WHERE子句在GROUP BY分组和聚合函数之前对数据行进行过滤；
# HAVING子句对GROUP BY分组和聚合函数之后的数据行进行过滤。
SELECT job, COUNT(*) FROM emp 
  WHERE age < 45 
  GROUP BY job HAVING COUNT(*) >= 2;

# ORDER BY 


# limit index, size
SELECT * from emp LIMIT 0, 10;
SELECT * from emp LIMIT 10, 10;

```



### DCL 用户权限管理

```sql
USE mysql;
SELECT * from user;

CREATE user 'afacode'@'localhost' IDENTIFIED by '123456';

CREATE user 'afacode'@'%' IDENTIFIED by '123456';

ALTER user 'afacode'@'%' IDENTIFIED WITH mysql_native_password by '1234';

DROP user 'afacode'@'localhost';



SHOW GRANTS FOR 'afacode'@'localhost';

GRANT ALL ON *.* TO 'afacode'@'localhost';

REVOKE ALL ON *.* TO 'afacode'@'localhost';

```

### 函数

### 约束

```sql
-- 添加外键
alter table emp add constraint fk_emp_dept_id foreign key (dept_id) references dept(id);

```

### 多表查询

```sql
# 内连接 交集
select emp.name, dept.name from emp , dept where emp.dept_id = dept.id ;
select e.name, d.name from emp e inner join dept d  on e.dept_id = d.id;

# 外连接 左外连接：以左表为基础 右外连接
select e.*, d.name from emp e left outer join dept d on e.dept_id = d.id;
select e.*, d.name from emp e left join dept d on e.dept_id = d.id;


select d.*, e.* from emp e right outer join dept d on e.dept_id = d.id;
select d.*, e.* from dept d left outer join emp e on e.dept_id = d.id;

# 自连接
select a.name , b.name from emp a , emp b where a.managerid = b.id;
select a.name '员工', b.name '领导' from emp a left join emp b on a.managerid = b.id;

# 联合查询
select * from emp where salary < 5000
union all
select * from emp where age > 50;
## 去重
select * from emp where salary < 5000
union
select * from emp where age > 50;


# 子查询
标量子查询
select * from emp where dept_id = (select id from dept where name = '销售部');

## 列子查询 all in not-in some any
select * from emp where dept_id in (select id from dept where name = '销售部' or name = '市场部');

select * from emp where salary > all ( select salary from emp where dept_id = (select id from dept where name = '财务部') );

## 行子查询 == <> IN NOT IN
select * from emp where (salary,managerid) = (select salary, managerid from emp where name = '张无忌');

## 表子查询 IN
select * from emp where (job,salary) in ( select job, salary from emp where name = '鹿杖客' or name = '宋远桥' );

select e.*, d.* from (select * from emp where entrydate > '2006-01-01') e left join dept d on e.dept_id = d.id ;

```

### 事务

```sql
select @@autocommit;
set @@autocommit = 0; -- 设置为手动提交

select * from account where name = '张三';
update account set money = money - 1000 where name = '张三';
update account set money = money + 1000 where name = '李四';


-- 提交事务
commit;

-- 回滚事务
rollback ;



-- 2 
-- 转账操作 (张三给李四转账1000)
start transaction ;

-- 1. 查询张三账户余额
select * from account where name = '张三';

-- 2. 将张三账户余额-1000
update account set money = money - 1000 where name = '张三';

程序执行报错 ...

-- 3. 将李四账户余额+1000
update account set money = money + 1000 where name = '李四';


-- 提交事务
commit;

-- 回滚事务
rollback;




-- 查看事务隔离级别
select @@transaction_isolation;

-- 设置事务隔离级别
set session transaction isolation level read uncommitted ;

set session transaction isolation level repeatable read ;

```





### 



# typeorm
[typeorm](https://typeorm.nodejs.cn/)

```js
userRepository.insert(user)
userRepository.update(user)
userRepository.save(user)
userRepository.delete(user)
```


## [find=>select](https://typeorm.nodejs.cn/find-options)

```html
find、findBy、findAndCount、findAndCountBy findOne findOneBy findOneOrFail
```

[EntityManager](https://typeorm.nodejs.cn/entity-manager-api)

```typescript
await manager.transaction(async (manager) => {
    // query - 执行原始 SQL 查询。
    const rawData = await manager.query(`SELECT * FROM USERS`)
})
```

[使用查询构建器选择](https://typeorm.nodejs.cn/select-query-builder) 重点

```typescript
SelectQueryBuilder
InsertQueryBuilder
UpdateQueryBuilder
DeleteQueryBuilder
RelationQueryBuilder
```

