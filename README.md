# Technologies

Project uses various technologies defined in subdirectories of this repo.

Technologies defined here, are present in frontend as well as backend, they include:

- JavaScript *duh*
- TypeScript
- Node
- Yarn package manager
- Prettier

You should have at least basic knowledge about these technologies before committing. :)

# Running app in production

**1. Install dependencies**

```shell
yarn install
```

**2. Build frontend**

```shell
cd PlaylistDJ.Frontend && yarn run build
```

**3. Build backend**

```shell
cd PlaylistDJ.API && yarn run build
```

**4. Start database**

_MongoDB was used in development. The usage if an ORM makes it possible to connect to different databases Although not tested._

```shell
mongod
```

Alternatively you can provide a [connection string](https://docs.mongodb.com/manual/reference/connection-string/)
in `PlaylistDJ.API/mikro-orm.config.ts`

OR

Modify said file to connect do a different [supported database](https://mikro-orm.io/docs/installation)

Either way if the ORM cannot connect to the DB, the backend will crash

**5. Start backend**

```shell
cd PlaylistDJ.API && yarn run start
```

# Folder structure

Root directory contains various parts of the service

- `PlaylistDJ.API` is a backend code
- `PlaylistDJ.Frontend` contains the frontend code
- `PlaylistDJ.Types` for type definitions used in multiple places

# Creating pull requests

Please read through the guidelines for committing code.

- Create a branch with the correct name *(details below)*
- Use Prettier
- Commit often with less code

<details>
<summary>For IntelliJ platform users</summary>

1. In Project view click the root (`playlist-dj`) directory
2. Select `Code > Reformat Code`
3. Check
    - Optimize imports
    - Rearrange entries
    - Cleanup code
4. Run

</details>

## Branch naming

Branches should respect the following naming convention

`action-branch_name`

**Action** specifies a purpose for a branch

1. `bugfix` code related to fixing a bug
2. `feature` adding code for the purpose of creating a feature
3. `cleanup` code removal, refactor, etc...

**Branch name** summarises what kind of task was made.

- use_snake_case_to_split_your_words

Examples:

```text
bugfix-removing_user_backend_crash
feature-adding_filters
cleanup-playlist_automations
```
