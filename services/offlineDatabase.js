import AsyncStorage from '@react-native-community/async-storage';

/**
 * Offline Database Service to store offline data in the application
 * which can be used when the application is not online.
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({
  name: 'offlineDatabase.db',
  createFromLocation: '~offlineDatabase.db',
});

class OfflineDatabase {
  constructor() {
    this.lawCategories = new Array();
    this.searchedNode = null;
  }

  /**
   * Sets the offline law categories tree from server.
   * @param {*} data
   */
  setOfflineLawCategories(data) {
    this.lawCategories = data;
  }

  /**
   * Returns offline law categories tree.
   */
  getAllOfflineLawCategories() {
    return this.lawCategories;
  }

  /**
   * Get law sub category from offline law categories tree
   * with matching law id and ancestor_law_number
   * @param {*} lawID
   * @param {*} ancestor_law_number
   */
  getMatchingOfflineLawCategories(lawID, ancestor_law_number) {
    this.searchedNode = null;

    return new Promise((resolve, reject) => {
      this.lawCategories.forEach(item => {
        if (item.offline == 1) {
          if (item.id == lawID) {
            // console.log('nested law sub categories are' + JSON.stringify(item));
            this.searchedNode = item;
            //return item.children;
          } else {
            this.checkLawCategoryChildrens(
              lawID,
              ancestor_law_number,
              item.children,
            );
          }
        }
      });

      setTimeout(() => {
        resolve(this.searchedNode);
      }, 1000);
    });
    //return [];
    // console.log('nested law sub categories are nothing found' );
  }

  /**
   * Checks the law sub categories to return the matching law sub category childrens
   * @param {*} lawSubCategories
   */
  checkLawCategoryChildrens(lawID, ancestor_law_number, lawSubCategories) {
    if (lawSubCategories.length > 0) {
      lawSubCategories.forEach(item => {
        if (
          item.offline == 1 &&
          item.ancestor_law_number == ancestor_law_number
        ) {
          if (item.id == lawID) {
            //console.log('nested law sub categories are' + JSON.stringify(item));
            this.searchedNode = item;
          } else {
            this.checkLawCategoryChildrens(
              lawID,
              ancestor_law_number,
              item.children,
            );
          }
        }
      });
    } else {
      return [];
    }
    //return [];
  }

  /**
   * Initializes the database tables.
   */
  initializeTables() {
    this.createLawCategoriesTable();
    this.createLawSubCategoriesTable();
    this.createArticlesTable();
  }

  /*
   * Creating new law categories table
   */
  createLawCategoriesTable() {
    db.transaction(function(txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='lawcategories'",
        [],
        function(tx, res) {
          if (res.rows.length == 0) {
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS lawcategories(id INTEGER PRIMARY KEY,title VARCHAR(250),isAvailable boolean,accessible boolean,is_leaf boolean)',
              [],
            );
          }
        },
      );
    });
  }

  /*
   * Creating new law sub categories table
   */
  createLawSubCategoriesTable() {
    db.transaction(function(txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='lawsubcategories'",
        [],
        function(tx, res) {
          if (res.rows.length == 0) {
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS lawsubcategories(id INTEGER PRIMARY KEY,title VARCHAR(300),parent_id INTEGER,isAvailable boolean,accessible boolean,is_leaf boolean,ancestor_law_number VARCHAR(300))',
              [],
            );
          }
        },
      );
    });
  }

  /*
   * Creating new articles table
   */
  createArticlesTable() {
    db.transaction(function(txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='articles'",
        [],
        function(tx, res) {
          if (res.rows.length == 0) {
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS articles(id INTEGER PRIMARY KEY AUTOINCREMENT,articleId INTEGER UNIQUE,title VARCHAR(300),introduction TEXT,body TEXT,nextArticleId INTEGER,previousArticleId INTEGER,law_category_id INTEGER,ancestor_law_number VARCHAR(300))',
              [],
            );
          }
        },
      );
    });
  }

  /**
   * Storing all law categories in lawcategories table
   * @param {*} lawcategories
   */
  storeLawCategories(lawcategories) {
    for (let i = 0; i < lawcategories.length; i++) {
      this.insertLawCategory(lawcategories[i]);
    }
  }

  /**
   * Storing all law sub categories in lawcategories table
   * @param {*} sublawcategories
   */
  storeLawSubCategories(sublawcategories) {
    for (let i = 0; i < sublawcategories.length; i++) {
      this.insertLawSubCategory(sublawcategories[i]);
    }
  }

  /**
   * Storing all articles in article table
   * @param {*} articles
   */
  storeArticles(articles) {
    for (let i = 0; i < articles.length; i++) {
      this.insertArticle(articles[i]);
    }
  }

  /**
   * Inserting each law category in lawcategories table one by one
   * @param {*} item
   * Only two law categories available offline
   * "ΑΣΤΙΚΟ ΔΙΚΑΙΟ - ΠΟΛΙΤΙΚΗ ΔΙΚΟΝΟΜΙΑ" and "ΠΟΙΝΙΚΟ ΔΙΚΑΙΟ - ΠΟΙΝΙΚΗ ΔΙΚΟΝΟΜΙΑ"
   */
  insertLawCategory(item) {
    let isAvailable = false;
    if (
      item.title == 'ΑΣΤΙΚΟ ΔΙΚΑΙΟ - ΠΟΛΙΤΙΚΗ ΔΙΚΟΝΟΜΙΑ' ||
      item.title == 'ΠΟΙΝΙΚΟ ΔΙΚΑΙΟ - ΠΟΙΝΙΚΗ ΔΙΚΟΝΟΜΙΑ'
    ) {
      isAvailable = true;
    }

    db.transaction(function(tx) {
      tx.executeSql(
        'INSERT INTO lawcategories (id,title,isAvailable,accessible,is_leaf) VALUES (?,?,?,?,?)',
        [item.id, item.title, isAvailable, item.accessible, item.is_leaf],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('adding law category' + results.rows.length);
          } else {
            //alert('Failed');
          }
        },
      );
    });
  }

  /**
   * Inserting each law sub category in lawsubcategories table one by one
   * @param {*} item
   * show available categoryId 2880,2774 for parentId 2773 ('ΑΣΤΙΚΟ ΔΙΚΑΙΟ - ΠΟΛΙΤΙΚΗ ΔΙΚΟΝΟΜΙΑ') and
   * show available categoryId 9019,9094 for parentId 2420 ('ΠΟΙΝΙΚΟ ΔΙΚΑΙΟ - ΠΟΙΝΙΚΗ ΔΙΚΟΝΟΜΙΑ')
   */
  insertLawSubCategory(item) {
    let isAvailable = true;
    if (item.parent_id == 2773 || item.parent_id == 2420) {
      isAvailable = false;
      if (
        item.id == 2880 ||
        item.id == 2774 ||
        item.id == 9019 ||
        item.id == 9094
      ) {
        isAvailable = true;
      }
    }
    console.log(item.id + JSON.stringify(isAvailable));

    db.transaction(function(tx) {
      tx.executeSql(
        'INSERT INTO lawsubcategories (id,title,parent_id,isAvailable,accessible,is_leaf,ancestor_law_number) VALUES (?,?,?,?,?,?,?)',
        [
          item.id,
          item.title,
          item.parent_id,
          isAvailable,
          item.accessible,
          item.is_leaf,
          item.ancestor_law_number,
        ],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('adding law category' + results.rows.length);
          } else {
            //alert('Failed');
          }
        },
      );
    });
  }

  /**
   * Inserting each article in articles table one by one
   * @param {*} item
   */
  insertArticle(item) {
    let introduction = '';
    if (item.introduction) {
      introduction = item.introduction;
    }
    db.transaction(function(tx) {
      tx.executeSql(
        'INSERT INTO articles (articleId,title,introduction,body,nextArticleId,previousArticleId,law_category_id,ancestor_law_number) VALUES (?,?,?,?,?,?,?,?)',
        [
          item.id,
          item.title,
          introduction,
          item.body,
          item.nextArticleId,
          item.previousArticleId,
          item.law_category.id,
          item.law_category.ancestor_law_number,
        ],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('adding articles' + results.rows.length);
          } else {
            console.log('adding articles failed');
          }
        },
        (t, error) => {
          console.log(JSON.stringify(error));
        },
      );
    });
  }

  /**
   * Insert new article when user updates new update
   * @param {*} item
   */
  insertArticlesOnUpdate(item) {
    let introduction = '';
    if (item.introduction) {
      introduction = item.introduction;
    }
    db.transaction(function(tx) {
      tx.executeSql(
        'INSERT INTO articles (articleId,title,introduction,body,nextArticleId,previousArticleId,law_category_id,) VALUES (?,?,?,?,?,?,?)',
        [
          item.id,
          item.title,
          introduction,
          item.body,
          item.nextArticleId,
          item.previousArticleId,
          item.law_category_id,
        ],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('adding articles' + results.rows.length);
          } else {
            console.log('adding articles failed');
          }
        },
        (t, error) => {
          console.log(JSON.stringify(error));
        },
      );
    });
  }

  /**
   * Returns the law categories from the database
   */
  getLawCategories() {
    return new Promise(function(resolve, reject) {
      db.transaction(function(tx) {
        tx.executeSql(
          'SELECT * FROM lawcategories ORDER BY isAvailable DESC',
          [],
          (tx, results) => {
            var len = results.rows.length;
            let lawCategories = [];
            if (len > 0) {
              for (let i = 0; i < results.rows.length; i++) {
                lawCategories.push(results.rows.item(i));
              }
              console.log('offline laws' + JSON.stringify(lawCategories));
              resolve(lawCategories);
            } else {
              reject('No Data Offline');
            }
          },
        );
      });
    });
  }

  /**
   * Returns the law sub categories from the database
   * @param {*} parentId
   */
  getLawSubCategories(parentId) {
    return new Promise(function(resolve, reject) {
      db.transaction(function(tx) {
        tx.executeSql(
          'SELECT * FROM lawsubcategories where parent_id=? ORDER BY isAvailable DESC',
          [parentId],
          (tx, results) => {
            var len = results.rows.length;
            let lawCategories = [];
            if (len > 0) {
              for (let i = 0; i < results.rows.length; i++) {
                lawCategories.push(results.rows.item(i));
              }
              console.log(
                'offline sub law categories' + JSON.stringify(lawCategories),
              );
              resolve(lawCategories);
            } else {
              reject('No Data Offline');
            }
          },
        );
      });
    });
  }

  /**
   * Returns the article from the database on the basis of articleId
   * @param {*} articleId
   */
  getArticle(articleId) {
    console.log('articleId is ' + articleId);
    return new Promise(function(resolve, reject) {
      db.transaction(function(tx) {
        tx.executeSql(
          'SELECT * FROM articles where articleId=? ORDER BY articleId',
          [articleId],
          (tx, results) => {
            console.log('kkkk' + JSON.stringify(results));
            var len = results.rows.length;
            let articles = [];
            if (len > 0) {
              for (let i = 0; i < results.rows.length; i++) {
                articles.push(results.rows.item(i));
              }
              console.log('offlinearticle111' + JSON.stringify(articles));
              if (articles.length == 1) {
                resolve(articles[0]);
              } else {
                resolve(articles);
              }
            } else {
              reject('No Data Offline');
            }
          },
        );
      });
    });
  }

  /**
   * Returns the articles list from the database on the basis of categoryId
   */
  getArticles(categoryId, page) {
    return new Promise(function(resolve, reject) {
      db.transaction(function(tx) {
        tx.executeSql(
          'SELECT * FROM articles where law_category_id=? ORDER BY articleId ASC',
          [categoryId],
          (tx, results) => {
            var len = results.rows.length;
            let articlesList = [];
            if (len > 0) {
              for (let i = 0; i < results.rows.length; i++) {
                articlesList.push(results.rows.item(i));
              }
              console.log('offline laws' + JSON.stringify(articlesList));
              resolve(articlesList);
            } else {
              reject('No Data Offline');
            }
          },
        );
      });
    });
  }

  /**
   * Method used to return articles when searches from footer.
   * Returns all the articles with the matching ancestor_law_number and
   * article
   * 'SELECT * FROM articles where title LIKE ? and ancestor_law_number=?'
   *  'SELECT * FROM articles where ancestor_law_number=?  VALUES (?,?) ORDER BY articleId ASC',
   * @param {*} article
   * @param {*} ancestor_law_number
   *  ['%{}%'.format(article)],
   */
  getMatchingLawAncestorArticles(article, ancestor_law_number) {
    let articleRegex = '%' + article + '%';
    console.log(
      'articles when internet is off' + article + ancestor_law_number,
    );
    return new Promise(function(resolve, reject) {
      db.transaction(function(tx) {
        tx.executeSql(
          'SELECT * FROM articles where ancestor_law_number=? AND title like ? ORDER BY title ASC',
          [ancestor_law_number, articleRegex],
          (tx, results) => {
            var len = results.rows.length;
            let articlesList = [];
            if (len > 0) {
              for (let i = 0; i < results.rows.length; i++) {
                articlesList.push(results.rows.item(i));
              }
              console.log('offline articles' + JSON.stringify(articlesList));
              resolve(articlesList);
            } else {
              reject('No Data Offline');
            }
          },
          (tx, err) => {
            console.log('articles when internet is off' + err);
          },
        );
      });
    });
  }

  /**
   * Method that deletes the article from offline storage.
   * @param {*} articleId
   */
  deleteArticle(articleId) {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM articles where articleId=?',
        [articleId],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
          } else {
            //alert('Please insert a valid User Id');
          }
        },
      );
    });
  }

  updateArticle(article) {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE articles set title=?, body=?, law_category_id=?, introduction=?,nextArticleId = ?,previousArticleId = ? where articleId=?',
        [
          article.title,
          article.body,
          article.law_category_id,
          article.introduction,
          article.nextArticleId,
          article.previousArticleId,
          article.id,
        ],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('updating article');
          } else {
            console.log('Inserting artile');
            this.insertArticlesOnUpdate(article);
          }
        },
      );
    });
  }
  setToggelOfflineTime(toggleActionTime) {
    console.log('currentTimeAsync' + toggleActionTime);
    AsyncStorage.setItem('offlineToggleTime', JSON.stringify(toggleActionTime));
  }

  getToggleOfflineTime() {
    AsyncStorage.getItem('offlineToggleTime').then(value => {
      console.log('getOfflineToggleTime' + value);
      return value;
    });
  }
}

export default new OfflineDatabase();
