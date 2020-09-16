import moment from 'moment'

export const capitalizeString = string =>{
  if(string){
    return string[0].toUpperCase() + string.slice(1)
  } else {
    return ''
  }
};

export const getKeyArray = (dataArray) => dataArray.map(obj => obj.key)

export const getDocCountByKey = (bucket,key) => {
  for(var i = 0; i<bucket.length; i++ ){
    if(bucket[i].key === key){
      return bucket[i].doc_count
    } 
  }
  return 0
}

export  const addMonths = (date, months) =>{
    var d = date.getDate();
        date.setMonth(date.getMonth() + months);
        if (date.getDate() !== d) {
          date.setDate(0);
        }
        return moment(date).format('DD-MM-YYYY');
}

export const getDatesArray = (startDate, endDate) =>{
  let dates = [];
  let currDate = moment.utc(new Date(`${startDate.split('-')[1]}-${startDate.split('-')[0]}-${startDate.split('-')[2]}`)).startOf("day");
  let lastDate = moment.utc(new Date(`${endDate.split('-')[1]}-${endDate.split('-')[0]}-${endDate.split('-')[2]}`)).startOf("day");
  do {
    dates.push(moment(currDate.clone().toDate()).format('YYYY-MM-DD'));
  } while (currDate.add(1, "days").diff(lastDate) < 0);
  dates.push(moment(currDate.clone().toDate()).format('YYYY-MM-DD'));
  return dates
}