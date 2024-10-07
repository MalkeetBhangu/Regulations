/**
 * Offline Search Service is used to store searched articles from footer and return them in pages.
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
class OfflineSearch {
  constructor() {
    this.searchedData = [];
  }

  /**
   * Stores offline data
   * @param {*} data
   */
  setSearchedData(data) {
    this.searchedData = data;
  }

  /**
   * Returns data from whole with the matching page
   * @param {*} page
   */
  loadMoreSearchedData(page) {
    startIndex = page * 10;
    endIndex = startIndex + 10;

    let searchResponse = {
        articles:{
            total:this.searchedData.length,
            data:[]
        }
    };

    let self = this;

    return new Promise((resolve,reject)=>{
        if (startIndex < self.searchedData.length) {
            searchResponse.articles.total = self.searchedData.length;
            searchResponse.articles.data = self.searchedData.slice(startIndex, endIndex);
          } else {
            searchResponse.articles.total = self.searchedData.length;
            searchResponse.articles.data = [];
          }

          setTimeout(()=>{
            resolve(searchResponse)
          },2000)

    });
  }
}
export default new OfflineSearch();
