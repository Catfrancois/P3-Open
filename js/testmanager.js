/**
 * Gestion des articles en objet
 * Gere le tri par date
 * et le formatage des dates pour affichage
 

class ArticleManager {
  constructor(listArticle) {
    this.listArticle = listArticle;
  }

  sort() {
    this.listArticle.sort((a, b) => {
      return Date.parse(a.publicationDate) < Date.parse(b.publicationDate)
        ? 1
        : -1;
    });
  }
}
*/
