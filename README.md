# Technologies

Project uses various technologies defiend in subdirectories of this repo.

Technologies defined here, are present in frontend as well as backend, they include:

- JavaScript *duh*
- TypeScript
- Node
- Yarn package manager
- Prettier

You should have at least basic knowledge about these technologies before committing. :)

# Folder structure

Root directory contains the two parts of the service

- `PlaylistDJ.API` is a backend code
- `PlaylistDJ.Frontend` as name suggests contains the frontend code

# Creating pull requests

Please read through the guidelines for committing code.

- **DO NOT COMMIT DIRECTLY TO DEVELOP**
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

If your branch could be assigned multiple actions then you 👏 need 👏 to 👏 split 👏 your 👏 code. Although I'm not keen
on enforcing this rule.

**Branch name** summarises what kind of task was made.

- use_snake_case_to_split_your_words

Examples:

```text
bugfix-removing_user_backend_crash
feature-adding_filters
cleanup-playlist_automations
```
