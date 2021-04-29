const router = require("express").Router(),
    multer = require("multer");

module.exports = function (storages, options = {}) {
    for (let storage of storages) {

        // `list` endpoint
        router.get(`/${storage.code}/list`, async function (req, res) {
            let result = await storage.list(req.query.path);
            return res.json(result);
        });

        // `mkdir` endpoint
        router.post(`/${storage.code}/mkdir`, async function (req, res) {
            await storage.mkdir(req.query.path, req.query.name);
            return res.sendStatus(200);
        });

        // `delete` endpoint
        router.post(`/${storage.code}/delete`, async function (req, res) {
            await storage.delete(req.query.path);
            return res.sendStatus(200);
        });

        // `readTextFile` endpoint
        router.get(`/${storage.code}/readTextFile`, async function (req, res) {
            let result = await storage.readTextFile(req.query.path);
            return res.json(result);
        });

        // `writeTextFile` endpoint
        router.post(`/${storage.code}/writeTextFile`, async function (req, res) {
            await storage.writeTextFile(req.query.path, req.body);
            return res.sendStatus(200);
        });
    }
    return router;
}
