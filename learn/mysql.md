# mysql



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

[使用查询构建器选择](https://typeorm.nodejs.cn/select-query-builder)

```typescript
SelectQueryBuilder
InsertQueryBuilder
UpdateQueryBuilder
DeleteQueryBuilder
RelationQueryBuilder



```

