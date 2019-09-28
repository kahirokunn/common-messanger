## Install方法

```bash
$ yarn install && yarn build && cd example/expo && yarn install
```

### 解説

postinstallでコピーしているだけ
その理由は、
npm linkだとexpoがシンボリックリンク非サポートなのでできない

rsync使っている理由はcp -rだとnode_modulesが再起コピーされるので、rsyncのexcludeオプションを使うと楽だったから
