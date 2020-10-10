const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');


const postModel = require('../model/post')


// ************* create Post ***************

router.post('/createpost', auth, async (req, res) => {
    try {
        let post = req.body
        if (!post.Title || !post.Body) {
            return res.status(400).json({ error: 'Please fill all the field' })
        }
        post.Postedby = req.user
        new postModel(post).save((error, result) => {
            if (error) {
                res.status(400).json({ error: 'error In post post' })
            }
            res.status(200).json('posted succesfully')
        })
    } catch (error) {
        res.status(400).json({ error: 'error In post post' })
    }
})

// ************* update Post ***************

router.patch('/updatepost/:id', auth, async (req, res) => {
    try {
        const user = req.user
        const id = req.params.id
        const post = req.body
        postModel.findOneAndUpdate({ _id: id, Postedby: user._id }, post).then((data) => {
            if (!data) {
                return res.status(400).josn({ error: 'data not found' })
            }
            res.status(200).send('update successfulyy')
        }).catch((err) => {
            res.status(200).send('error to update data')
        })
    } catch (error) {
        res.status(400).json({ error: 'there is some error ocuured' })
    }
})

// ************* my Post ***************

router.get('/mypost', auth, async (req, res) => {
    try {
        const user = req.user
        const post = await postModel.find({ Postedby: user._id })
        if (!post) {
            return res.status(400).send('no post available')
        }
        res.send(post)
    } catch (error) {
        return res.status(400).send('no post available')
    }
})

// ************* delete Post ***************

router.delete('/deletepost/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        await postModel.findByIdAndDelete(id).then(() => {
            return res.status(200).send('post delete success')
        }).catch((err) => {
            return res.status(400).json({ error: 'post delete success' })
        })

    } catch (error) {
        return res.status(200).json({ error: 'there is some error' })
    }
})


// ************* All Post With Pagignation ***************
router.get('/allpost', async (req, res) => {
    let qpage = req.query.page
    const pages = (qpage * 9) - 9
    try {
        await postModel.find().populate('Postedby').skip(pages).limit(9).sort('createdAt').then((data) => {
            postModel.find().countDocuments().then((num) => {
                res.status(200).send({ 'doc': num, 'data': data })
            })
        })
    } catch (error) {
        res.status(400).json({ error: 'Error in fetch data' })
    }
})

module.exports = router
