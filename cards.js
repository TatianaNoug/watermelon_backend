const express = require('express');
const bodyParser = require('body-parser');

let cardsRouter = express.Router();
cardsRouter.use(bodyParser.urlencoded({extended: true}));


/****************************/
/********** CARDS ***********/
/****************************/

cardsRouter.post('/', function (req, res) {
    let id = req.body.user_id;
    let last_4_digits = req.body.last_4;
    let cardBrand = req.body.brand;
    let expiredDate = req.body.expired_at;

    if (id === undefined || last_4_digits === undefined || cardBrand === undefined || expiredDate === undefined) {
        res.status(400).json({message: "Missing Fields"})
    } else {
        if(expiredDate < Date.now()){
            res.status(400).json({message: "Expired Date"})
        }else {
            let query = "INSERT INTO cards (user_id, last_4, brand, expired_at) VALUES (?, ?, ?, ?)";

            req.db.query(query,[id, last_4_digits, cardBrand, expiredDate], function (err, result, fields) {
                if (err) throw err;

                if(result.affectedRows > 0){
                    const newCard = {
                        id: result.insertId,
                        user_id: id,
                        last_4: last_4_digits,
                        brand: cardBrand,
                        expired_at: expiredDate
                    };
                    res.status(200).json(newCard);
                }

            });
        }
    }
});

cardsRouter.get('/', function (req, res) {

    let query = "SELECT *  FROM cards ";

    req.db.query(query, function (err, result, fields) {
        if (err) throw err;
        const selectedCards =[];
        for(let i = 0; i<result.length; i++) {
            const tempCard ={
                id:result[i].id,
                user_id:result[i].user_id,
                last_4:result[i].last_4,
                brand:result[i].brand,
                expired_at:result[i].expired_at
            }
            selectedCards.push(tempCard);
        };

        res.status(200).json(selectedCards);
    });
});

cardsRouter.get('/:id(\\d+)', function (req, res) {

    const id = req.params.id;

    let query = "SELECT *  FROM cards WHERE id=?";

    req.db.query(query,[id], function (err, result, fields) {
        if (err) throw err;
        if(result.length > 0) {
            const selectedCard = {

                id: result[0].id,
                user_id: result[0].user_id,
                last_4: result[0].last_4,
                brand: result[0].brand,
                expired_at: result[0].expired_at
            }

            res.status(200).json(selectedCard);
        }else{
            res.status(404).json({message:"Card not found"});
        }
    });

});

cardsRouter.put('/:id(\\d+)', function (req, res) {

    const id = req.params.id;
    const last_4 = req.body.last_4;

    let query = "UPDATE cards SET last_4=? WHERE id=?";

    req.db.query(query, [last_4, id], function (err, result, fields) {
        if (err) throw err;

        if(result.affectedRows > 0) {
            let query = "SELECT * FROM cards WHERE id =?"
            req.db.query(query,[id], function (err, result, fields) {
                const updatedCard = {
                    id: result[0].id,
                    user_id: result[0].user_id,
                    last_4: result[0].last_4,
                    brand: result[0].brand,
                    expired_at: result[0].expired_at
                }
                res.status(200).json(updatedCard);
            })

        }else{
            res.status(404).json({message: "Card not found"})
        }
    })

});

cardsRouter.delete('/:id(\\d+)', function (req, res) {
    let id = req.params.id;

    let query = "DELETE FROM cards WHERE id=?";

    req.db.query(query,[id], function (err, result, fields) {
        if (err) throw err;

        if(result.affectedRows > 0) {
            res.status(204).json({message: "Card deleted"});
        }else{
            res.status(404).json({message: "Card not found"})
        }
    })
});

module.exports = cardsRouter;
