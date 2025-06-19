import Dexie from 'dexie';

export const db = new Dexie('CategorieDB');

db.version(1).stores({
    categories: '++id, nom',
    sousCategories: '++id, nom, categorie_id',
    sousSousCategories: '++id, nom, sous_categorie_id',
});
