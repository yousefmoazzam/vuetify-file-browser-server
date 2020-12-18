const os = require("os"),
    nodePath = require("path"),
    fsPromises = require("fs").promises,
    readdir = fsPromises.readdir,
    stat = fsPromises.stat,
    mv = require("mv"),
    unlink = fsPromises.unlink,
    lstat = fsPromises.lstat,
    util = require("util"),
    rimraf = util.promisify(require("rimraf"));
    readFile = fsPromises.readFile
    writeFile = fsPromises.writeFile


class LocalStorage {
    constructor(root) {
        this.code = "local";
        if (root) {
            this.root = root;
        } else if (process.env.FILEBROWSER_LOCAL_ROOT_PATH) {
            this.root = nodePath.resolve(process.cwd(), process.env.FILEBROWSER_LOCAL_ROOT_PATH);
        } else {
            this.root = os.homedir();
        }
    }

    async list(path) {
        try {
            let dirs = [],
                files = [];

            if (path[path.length - 1] !== "/") {
                path += "/";
            }
            let items = await readdir(this.root + path, { withFileTypes: true });

            for (let item of items) {
                let isFile = item.isFile(),
                    isDir = item.isDirectory();

                if (!isFile && !isDir) {
                    continue;
                }

                let result = {
                    type: isFile ? "file" : "dir",
                    path: path + item.name,
                };

                result.basename = result.name = nodePath.basename(result.path);

                if (isFile) {
                    let fileStat = await stat(this.root + result.path);
                    result.size = fileStat.size;
                    result.extension = nodePath.extname(result.path).slice(1);
                    result.name = nodePath.basename(result.path, "." + result.extension);
                    files.push(result);
                } else {
                    result.path += "/";
                    dirs.push(result);
                }
            }

            return dirs.concat(files);
        } catch (err) {
            console.error(err);
        }
    }

    async upload(path, files) {
        try {
            for (let file of files) {
                await mv(file.path, this.root + path + file.originalname, (err) => {
                  console.log(err)
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    async mkdir(path) {
        await fsPromises.mkdir(this.root + path, { recursive: true });
    }

    async delete(path) {
        try {
            let stat = await lstat(this.root + path),
                isDir = stat.isDirectory(),
                isFile = stat.isFile();

            if (isFile) {
                await unlink(this.root + path);
            } else if (isDir) {
                await rimraf(this.root + path);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async readTextFile(path) {
        try {
            let fileContents = await readFile(this.root + path, 'utf-8');
            return fileContents;
        } catch (err) {
            console.log(err);
        }
    }

    async writeTextFile(path, data) {
        try {
            let fileWritePromise = await writeFile(this.root + path,
                data.configContent, 'utf-8');
            return fileWritePromise;
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = LocalStorage;
