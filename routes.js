const express = require('express');
const router = new express.Router();
const MyError = require('./error');
const items = require('./fakeDb');
router.get('/');

module.exports = router;

router.get('/', (req, res) => {
    res.json({ items })}
)

router.get('/:name', (req, res, next) => {
try{
    const item = items.find(i => i.name === req.params.name)
    if (!item){
        throw new MyError('Oops! Could not find that item!', 400)
    }
    res.json({item})
    } catch (e){
        next(e);
    }
}
)

router.post('/', (req, res, next) => {
try{
    const newItem = { name: req.body.name, price: req.body.price };
    if (!req.body.name){
        throw new MyError('Oops! An item needs a name!', 400)
    }
    
    if (!req.body.price || (typeof req.body.price !== 'number')){
        throw new MyError('Oops! An item needs a numerical price!', 400)
    }
    let foundDuplicate = global.items.find(item => item.name === req.body.name);
    if (foundDuplicate){
        throw new MyError('Oops! There is already an item with that name!', 400)
    }
    global.items.push(newItem);
    res.status(201).json({'added': newItem });
    } catch (e){
        next(e);
    }
}
)

router.patch('/:name', (req, res, next) => {
try{
    const foundItem = items.find(item => item.name === req.params.name)
    if (foundItem === undefined){
        throw new MyError('Oops! Could not find item!', 404)
    }
    if (!req.body.name){
        throw new MyError('Oops! An item needs a name!', 400)
    }
    if (!req.body.price || (typeof req.body.price !== 'number')){
        throw new MyError('Oops! An item needs a numerical price!', 400)
    }
    foundItem.name = req.body.name;
    foundItem.price = req.body.price;
    res.status(200).json({'updated': foundItem });
    } catch (e){
        next(e);
    }
}
)

router.delete('/:name', (req, res, next) => {
try{
    const foundItemIndex = items.findIndex(item => item.name === req.params.name)
    if (foundItemIndex === -1){
        throw new MyError('Oops! Could not find item!', 404)
    }
    global.items.splice(foundItemIndex, 1)
    res.status(200).json({message: "Deleted"});
    } catch (e){
        next(e);
    }
}
)
