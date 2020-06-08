const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
  projectId: 'covid19-ifr-2020',
  keyFilename: './keys/firestore-key-covid19-IFR.json',
});

// async function fetchTotalData(sourceCountries, estimateCountry) {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let temp = { data: [], IFR: [] };

//             if(!estimateCountry) reject({ message: "Must provide estimate country!" });
//             let snapshot = await db.collection('countriesTotal').doc(estimateCountry).get();
//             if(snapshot.data())
//                 temp.data.push(snapshot.data());

//             if(sourceCountries.length > 0) {
//                 for(source of sourceCountries) {
//                     snapshot = await db.collection('countriesTotal').doc(source).get();
//                     if(snapshot.data())
//                         temp.data.push(snapshot.data());
//                 }
//             }            

//             snapshot = await db.collection('IFR').get();

//             snapshot.forEach(doc => {
//                 if(doc.data())
//                     temp.IFR.push(doc.data());    
//             });            
//             resolve(temp);
//         } catch (error) {
//             reject(error);
//         }
//     });
// }

async function fetchTotalData(sourceCountries, estimateCountry, days) {
    return new Promise(async (resolve, reject) => {
        try {
            let temp = { data: [], IFR: [] };
            let collection = 'CountriesCollection', document = 'countries';

            if(!estimateCountry) reject({ message: "Must provide estimate country!" });
            let cData = [];
            let snapshot = await db.collection(collection).doc(document).collection(estimateCountry).orderBy('Date', 'desc').limit(days).get();
            snapshot.forEach( doc => {
                if(doc.data()) {
                    let d = doc.data();
                    d.Date = d.Date.toDate();
                    cData.push(d);
                }
            });
            if(cData.length > 0)
                temp.data.push({ slug: estimateCountry, data: cData });
            
            if(sourceCountries.length > 0) {
                for(source of sourceCountries) {
                    cData = [];
                    let snapshot = await db.collection(collection).doc(document).collection(source).orderBy('Date', 'desc').limit(days).get();
                    snapshot.forEach(doc => {
                        if(doc.data())
                        {
                            let d = doc.data();
                            d.Date = d.Date.toDate();
                            cData.push(d);
                        }
                    });
                    if(cData.length > 0)
                        temp.data.push({ slug: source, data: cData });                    
                }
            }

            snapshot = await db.collection('IFR').get();

            snapshot.forEach(doc => {
                if(doc.data())
                    temp.IFR.push(doc.data());    
            });            
            resolve(temp);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.fetchTotalData = fetchTotalData;