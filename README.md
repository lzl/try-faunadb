## [Try.FaunaDB](https://dashboard.fauna.com/db/try.faunadb)

Create collection

```js
const result = await client.query(q.CreateCollection({ name: 'accounts' }))
```

Create index

```js
const result = await client.query(
  q.CreateIndex({
    name: 'accounts_by_email',
    // permissions: { read: 'public' },
    source: q.Collection('accounts'),
    terms: [{ field: ['data', 'email'] }],
    unique: true,
  })
)
```

```js
const result = await client.query(
  q.CreateIndex({
    name: 'profile_by_accountRef',
    source: q.Collection('profiles'),
    terms: [{ field: ['data', 'accountRef'] }],
  })
)
```

Create account with password

```js
const result = await client.query(
  q.Create(q.Collection('accounts'), {
    credentials: { password: 'secret password' },
    data: {
      email: 'lizunlong@gmail.com',
    },
  })
)
```

Create account without password

```js
const result = await client.query(
  q.Let(
    {
      ref: q.Select(
        ['ref'],
        q.Create(q.Collection('accounts'), {
          data: {
            email: 'lizunlong@gmail.com',
          },
        })
      ),
      token: q.Create(q.Tokens(), { instance: q.Var('ref') }),
    },
    {
      token: q.Var('token'),
    }
  )
)
```

Login

```js
const result = await client.query(
  q.Login(q.Match(q.Index('accounts_by_email'), 'lizunlong@gmail.com'), {
    password: 'secret password',
  })
)
```

Logout (with token)

```js
const result = await client.query(q.Logout(true))
```

Get accounts data

```js
const result = await client.query(
  q.Map(
    q.Paginate(q.Documents(q.Collection('accounts')), { size: 3 }),
    q.Lambda('account', q.Select(['data'], q.Get(q.Var('account'))))
  )
)
```

Update account data

```js
const result = await client.query(
  q.Update(q.Ref(q.Collection('accounts'), '257525567624053259'), {
    data: { canPost: true },
  })
)
```

Create profile

```js
const result = await client.query(
  q.Create(q.Collection('profiles'), {
    data: {
      accountRef: q.Ref(q.Collection('accounts'), '257525567624053259'),
      username: 'LZL',
      createAt: q.Now(),
    },
  })
)
```

Update profile (with token)

```js
const result = await client.query(
  q.Map(
    q.Paginate(q.Match(q.Index('profile_by_accountRef'), q.Identity()), {
      size: 1,
    }),
    q.Lambda(
      'profile',
      q.Update(q.Var('profile'), { data: { username: 'LZL' } })
    )
  )
)
```

Create role

```js
const result = await client.query(
  q.CreateRole({
    name: 'can_read_posts',
    membership: [{ resource: q.Collection('accounts') }],
    privileges: {
      resource: q.Collection('posts'),
      actions: { read: true },
    },
  })
)
```

```js
const result = await client.query(
  q.CreateRole({
    name: 'can_create_posts',
    membership: [
      {
        resource: q.Collection('accounts'),
        predicate: q.Query(ref =>
          q.Select(['data', 'canPost'], q.Get(ref), false)
        ),
      },
    ],
    privileges: {
      resource: q.Collection('posts'),
      actions: {
        create: true,
      },
    },
  })
)
```

```js
const result = await client.query(
  q.CreateRole({
    name: 'can_write_self_profile',
    membership: [{ resource: q.Collection('accounts') }],
    privileges: [
      {
        resource: q.Index('profile_by_accountRef'),
        actions: {
          read: true,
        },
      },
      {
        resource: q.Collection('profiles'),
        actions: {
          write: q.Query((oldData, newData) =>
            q.And(
              q.Equals(q.Select(['data', 'accountRef'], oldData), q.Identity()),
              q.Equals(
                q.Select(['data', 'accountRef'], oldData),
                q.Select(['data', 'accountRef'], newData)
              )
            )
          ),
        },
      },
    ],
  })
)
```

```js
const result = await client.query(
  q.CreateRole({
    name: 'can_read_self_account',
    membership: [{ resource: q.Collection('accounts') }],
    privileges: [
      {
        resource: q.Collection('accounts'),
        actions: {
          read: q.Query(q.Lambda('ref', q.Equals(q.Var('ref'), q.Identity()))),
        },
      },
    ],
  })
)
```

Get role

```js
const result = await client.query(q.Get(q.Role('can_write_self_profile')))
```

Delete role

```js
const result = await client.query(q.Delete(q.Role('can_read_posts')))
```

Create post (with token)

```js
const result = await client.query(
  q.Create(q.Collection('posts'), {
    data: { title: '1nd post', createdBy: q.Identity(), createAt: q.Now() },
  })
)
```

Get key from secret

```js
const result = await client.query(
  q.KeyFromSecret('fnEDk0BxpOACCQOS4SgIoAIB-2OcLW5QS4vxxIHXlH-Ntr7fdbs')
)
```

Query transactions

```js
const result = await client.query(
  q.Map(
    q.Paginate(q.Documents(q.Collection('transactions')), { size: 3 }),
    q.Lambda('x', q.Get(q.Var('x')))
  )
)
```
