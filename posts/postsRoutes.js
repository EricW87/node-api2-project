const express = require('express');
const db = require('../data/db.js');

const router = express.Router();

router.post('/', (req, res) => {
    const post = req.body;

    if(!post.title || !post.contents)
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    else
        db
            .insert(post)
            .then(p =>
                res.status(201).json(p)
            )
            .catch(() =>
                res.status(500).json({error: "There was an error while saving the post to the database"})
            );
});

router.post('/:id/comments', (req, res) => {
    const {id} = req.params;
    const comment = req.body;

    if(!id)
        res.status(404).json({ error: "The post with the specified ID does not exist."});
    else if(!comment.text)
        res.status(400).json({ errorMessage: "Please provide text for the comment."});
    else
        db
            .findById(id)
            .then(post => {
                if(post.length === 0)
                    res.status(404).json({ error: "The post with the specified ID does not exist."})
                else
                    db
                        .insertComment(comment)
                        .then(c => res.status(201).json(c))
                        .catch(() => res.status(500).json({ error: "There was an error while saving the comment to the database" }));
            })
            .catch(() => res.status(500).json({ error: "The post information could not be retrieved" }));
});

router.get('/', (req, res) => {
    db
        .find()
        .then(p => res.status(200).json(p))
        .catch(() => res.status(500).json({ error: "The posts information could not be retrieved." }));
});

router.get('/:id', (req, res) => {
    const {id} = req.params;
    
    if(!id)
        res.status(404).json({ error: "The post with the specified ID does not exist."});
    else
        db
            .findById(id)
            .then(post => {
                if(post.length === 0)
                    res.status(404).json({ error: "The post with the specified ID does not exist."})
                else
                    res.status(200).json(post);
            })
            .catch(() => res.status(500).json({ error: "The post information could not be retrieved" }));
});

router.get('/:id/comments', (req, res) => {
    const {id} = req.params;

    if(!id)
        res.status(404).json({ error: "The post with the specified ID does not exist."});
    else
        db
        .findById(id)
        .then(post => {
            if(post.length === 0)
                res.status(404).json({ error: "The post with the specified ID does not exist."})
            else
                db
                    .findPostComments(id)
                    .then(comments => res.status(200).json(comments))
                    .catch(() => res.status(500).json({ error: "The comments information could not be retrieved" }));
        })
        .catch(() => res.status(500).json({ error: "The post information could not be retrieved" }));
});

router.delete('/:id', (req, res) => {
    const {id} = req.params;

    if(!id)
        res.status(404).json({ error: "The post with the specified ID does not exist."});
    else
        db
        .findById(id)
        .then(post => {
            if(post.length === 0)
                res.status(404).json({ error: "The post with the specified ID does not exist."})
            else
                db
                    .remove(id)
                    .then(num => res.status(204).json(num))
                    .catch(() => res.status(500).json({ error: "The post could not be removed." }));
        })
        .catch(() => res.status(500).json({ error: "The post information could not be retrieved" }));
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const post = req.body;

    if(!id)
        res.status(404).json({ error: "The post with the specified ID does not exist."});
    else if(!post.title || !post.contents)
        res.status(400).json({ errorMessage: "Please provide text for the comment."});
    else
        db
            .findById(id)
            .then(newpost => {
                if(newpost.length === 0)
                    res.status(404).json({ error: "The post with the specified ID does not exist."})
                else
                    db
                        .update(id, post)
                        .then(count => {
                            res.status(200).json(count);
                        })
                        .catch(() => res.status(500).json({ error: "The post information could not be modified" }));
            })
            .catch(() => res.status(500).json({ error: "The post information could not be retrieved" }));
});

module.exports = router;