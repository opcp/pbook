const express = require("express");
const url = require("url");
const mysql = require("mysql");
("body-parser");
const bluebird = require("bluebird");
const router = express.Router();
const db = mysql.createConnection({
  // host: '192.168.27.186',
  host: "localhost",
  user: "opcp",
  password: "opcp2428",
  database: "pbook"
});
db.connect();
bluebird.promisifyAll(db);
//書本單筆資料
router.get("/book_reviews/:sid?", (req, res) => {
  let sid = req.params.sid;
  console.log(req.query.id);
  const sql = `SELECT vb_books.*,cp_data_list.cp_name FROM vb_books LEFT JOIN cp_data_list ON vb_books.publishing = cp_data_list.sid WHERE vb_books.sid = ${sid}`;
  db.query(sql, (error, results) => {
    if (error) {
      return res.send(error);
    } else {
      return res.json({
        data: results
      });
    }
  });
});

//書本評分資料
// router.get("/book_ratings", (req, res) => {
//   const sql = `SELECT star,book FROM vb_ratings WHERE 1`;
//   db.query(sql, (error, results) => {
//     if (error) {
//       return res.send(error);
//     } else {
//       return res.json({
//         data: results
//       });
//     }
//   });
// });
router.get(`/book_ratings/?`, (req, res) => {
  let c,
    a,
    s,
    f,
    page,
    fiveStars = [],
    fourStars = [],
    threeStars = [],
    twoStars = [],
    oneStars = [],
    max = [],
    min = [],
    avg = [],
    totalStars = [],
    message = [],
    sql;
  const urlpart = url.parse(req.url, true);
  if (urlpart.query.c !== undefined) {
    c = "=" + urlpart.query.c;
  } else {
    c = "";
  }

  if (urlpart.query.a == 1) {
    a = "publish_date";
  } else if (urlpart.query.a == 2) {
    a = "page";
  } else {
    a = "sid";
  }
  s = urlpart.query.s || "";
  page = Number(urlpart.query.p) || 1;
  let perPage = 10;
  let output = {};
  output.c = c;
  output.page = page;
  output.perPage = perPage;
  // sql = `SELECT COUNT(1) total FROM vb_ratings WHERE 1 `;
  sql = `SELECT COUNT(1) total FROM vb_books LEFT JOIN vb_ratings ON vb_books.sid=vb_ratings.book WHERE categories ${c}`;
  db.queryAsync(sql)
    .then(results => {
      output.total = results[0]["total"];
      return db.queryAsync(
        `SELECT COUNT(1) total FROM vb_books WHERE categories ${c}`
      );
    })
    // .then(results => {
    //   output.totalRows = results[0]["total"]; //總筆數
    //   output.totalPage = Math.ceil(output.totalRows / perPage); //總頁數
    //   return db.queryAsync(
    //     `SELECT * FROM vb_books WHERE 1 LIMIT ${(page - 1) *
    //       perPage},${perPage}`
    //   );
    // })
    .then(results => {
      output.totalRows = results[0]["total"]; //總筆數
      output.totalPage = Math.ceil(output.totalRows / perPage); //總頁數
      return db.queryAsync(
        `SELECT vb_books.*,cp_data_list.cp_name FROM vb_books,cp_data_list WHERE categories ${c} AND name LIKE '%${s}%' AND vb_books.publishing = cp_data_list.sid ORDER BY sid DESC LIMIT ${(page -
          1) *
          perPage},${perPage}`
      );
    })
    .then(results => {
      output.rows = results;
      return db.queryAsync(
        `SELECT vb_books.*,vb_ratings.star FROM vb_books LEFT JOIN vb_ratings ON vb_books.sid=vb_ratings.book WHERE categories ${c}`
      );
    })
    .then(results => {
      if (page !== output.totalPage) {
        for (let j = 0; j < output.perPage; j++) {
          fiveStars[j] = 0;
          fourStars[j] = 0;
          threeStars[j] = 0;
          twoStars[j] = 0;
          oneStars[j] = 0;
          totalStars[j] = 0;
          message[j] = 0;
          for (let i = 0; i < output.total; i++) {
            if (output.rows[j].sid == results[i].sid) {
              message[j]++;
              switch (results[i].star) {
                case 5:
                  fiveStars[j]++;
                  break;
                case 4:
                  fourStars[j]++;
                  break;
                case 3:
                  threeStars[j]++;
                  break;
                case 2:
                  twoStars[j]++;
                  break;
                case 1:
                  oneStars[j]++;
                  break;
                default:
                  break;
              }
            }
          }
        }
        for (let j = 0; j < output.perPage; j++) {
          totalStars[j] =
            fiveStars[j] +
            fourStars[j] +
            threeStars[j] +
            twoStars[j] +
            oneStars[j];
          avg[j] = +(
            (fiveStars[j] * 5 +
              fourStars[j] * 4 +
              threeStars[j] * 3 +
              twoStars[j] * 2 +
              oneStars[j]) /
            totalStars[j]
          ).toFixed(1);
          max[j] = fiveStars[j];
          min[j] = fiveStars[j];
          if (fourStars[j] > max[j]) max[j] = fourStars[j];
          else if (fourStars[j] < min[j]) min[j] = fourStars[j];
          if (threeStars[j] > max[j]) max[j] = threeStars[j];
          else if (threeStars[j] < min[j]) min[j] = threeStars[j];
          if (twoStars[j] > max[j]) max[j] = twoStars[j];
          else if (twoStars[j] < min[j]) min[j] = twoStars[j];
          if (oneStars[j] > max[j]) max[j] = oneStars[j];
          else if (oneStars[j] < min[j]) min[j] = oneStars[j];
        }
        for (let j = 0; j < output.perPage; j++) {
          output.rows[j].fiveStars = fiveStars[j];
          output.rows[j].fourStars = fourStars[j];
          output.rows[j].threeStars = threeStars[j];
          output.rows[j].twoStars = twoStars[j];
          output.rows[j].oneStars = oneStars[j];
          output.rows[j].totalStars = totalStars[j];
          output.rows[j].max = max[j];
          output.rows[j].avg = avg[j];
          output.rows[j].message = message[j];
        }
      } else if (page == output.totalPage) {
        f = output.totalRows % output.perPage;
        if (f === 0) {
          f =+ 10;
        }
        for (let j = 0; j < f; j++) {
          fiveStars[j] = 0;
          fourStars[j] = 0;
          threeStars[j] = 0;
          twoStars[j] = 0;
          oneStars[j] = 0;
          totalStars[j] = 0;
          message[j] = 0;
          for (let i = 0; i < output.total; i++) {
            if (output.rows[j].sid == results[i].sid) {
              message[j]++;
              switch (results[i].star) {
                case 5:
                  fiveStars[j]++;
                  break;
                case 4:
                  fourStars[j]++;
                  break;
                case 3:
                  threeStars[j]++;
                  break;
                case 2:
                  twoStars[j]++;
                  break;
                case 1:
                  oneStars[j]++;
                  break;
                default:
                  break;
              }
            }
          }
        }
        for (let j = 0; j < f; j++) {
          totalStars[j] =
            fiveStars[j] +
            fourStars[j] +
            threeStars[j] +
            twoStars[j] +
            oneStars[j];
          avg[j] = +(
            (fiveStars[j] * 5 +
              fourStars[j] * 4 +
              threeStars[j] * 3 +
              twoStars[j] * 2 +
              oneStars[j]) /
            totalStars[j]
          ).toFixed(1);
          max[j] = fiveStars[j];
          min[j] = fiveStars[j];
          if (fourStars[j] > max[j]) max[j] = fourStars[j];
          else if (fourStars[j] < min[j]) min[j] = fourStars[j];
          if (threeStars[j] > max[j]) max[j] = threeStars[j];
          else if (threeStars[j] < min[j]) min[j] = threeStars[j];
          if (twoStars[j] > max[j]) max[j] = twoStars[j];
          else if (twoStars[j] < min[j]) min[j] = twoStars[j];
          if (oneStars[j] > max[j]) max[j] = oneStars[j];
          else if (oneStars[j] < min[j]) min[j] = oneStars[j];
        }
        for (let j = 0; j < f; j++) {
          output.rows[j].fiveStars = fiveStars[j];
          output.rows[j].fourStars = fourStars[j];
          output.rows[j].threeStars = threeStars[j];
          output.rows[j].twoStars = twoStars[j];
          output.rows[j].oneStars = oneStars[j];
          output.rows[j].totalStars = totalStars[j];
          output.rows[j].max = max[j];
          output.rows[j].avg = avg[j];
          output.rows[j].message = message[j];
        }
      }

      res.json(output);
    })
    .catch(error => {
      console.log(error);
    });
});

//新增書評API
router.post("/book_reviews/:sid?/data", (req, res) => {
  let book = [];
  const newbook = {
    id: req.body.id,
    book: req.body.book,
    reviewText: req.body.reviewText,
    star: req.body.star
  };
  book.push(newbook);
  const sql = `INSERT INTO vb_ratings (member, book, star, message, create_time) VALUES ('${book[0].id}', '${book[0].book}', '${book[0].star}', '${book[0].reviewText}', NOW())`;
  db.query(sql, (error, results) => {
    if (error) {
      return res.send(error);
    } else {
      return res.send("新增成功");
    }
  });
  console.log(book);
});

//書評資料
router.get("/memberReview/:book?", (req, res) => {
  let book = req.params.book;
  const sql = `SELECT vb_ratings.sid , vb_ratings.member , mr_level.MR_levelName,vb_ratings.message,vb_ratings.star,vb_ratings.book,mr_information.MR_nickname,book,mr_information.MR_pic,vb_ratings.create_time FROM mr_information,vb_ratings,mr_level WHERE mr_information.MR_number=vb_ratings.member AND mr_information.MR_personLevel=mr_level.MR_personLevel AND vb_ratings.book = ${book} ORDER BY vb_ratings.create_time ASC`;
  db.query(sql, (error, results) => {
    if (error) {
      return res.send(error);
    } else {
      return res.json({
        reviews: results
      });
    }
  });
});

//刪除書評API
router.delete("/deleteReview/:sid?", (req, res) => {
  let sid = req.params.sid;
  const sql = `DELETE FROM vb_ratings WHERE vb_ratings.sid = ${sid}`;
  db.query(sql, (error, results) => {
    if (error) {
      return res.send(error);
    } else {
      return res.send("刪除成功");
    }
  });
});

//更新書評API
router.put("/editReview/data", (req, res) => {
  let data = [];
  const reviews = {
    sid: req.body.sid,
    editReview: req.body.editReview
  };
  data.push(reviews);
  const sql = `UPDATE vb_ratings SET message = '${data[0].editReview}', update_time = NOW() WHERE vb_ratings.sid = ${data[0].sid}`;
  db.query(sql, (error, results) => {
    if (error) {
      return res.send(error);
    } else {
      return res.send("更新成功");
    }
  });
});

//加入書櫃
router.post("/bookcase", (req, res) => {
  let data = [];
  const bookcase = {
    number: req.body.number,
    isbn: req.body.isbn
  };
  //INSERT INTO br_bookcase(number, isbn, bookName,blog,created_time)VALUES('MR00166', '9789864777112','','', now())
  data.push(bookcase);
  const sql = `INSERT INTO br_bookcase(number,isbn,title,bookSid,bookName,blog,created_time) 
            VALUES('${data[0].number}','${data[0].isbn}','','1', '', '', now()) `;
  db.query(sql, (error, results) => {
    if (error) {
      return res.send(error);
    } else {
      return res.send("新增成功");
    }
  });
});

module.exports = router;
