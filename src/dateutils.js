var moment = require('moment')
var _dateUtils = function () {

    return {
        chunkDates:function(startDate, endDate, chunkSize){
            chunkSize = chunkSize>0?chunkSize:30
            var dateString1 = startDate
            var dateString2 = endDate
            var format = "L"
            var date1 = new Date(dateString1)
            var date2 = new Date(dateString2)
            var dateRanges = []
            var diff=date2-date1 //unit is milliseconds
            diff=Math.round(diff/1000/60/60/24)
            while(diff>=0){
                var endChunkDate = new Date(dateString1)
                endChunkDate.setTime(endChunkDate.getTime()+(1000*60*60*24*(chunkSize-1)))
                if(endChunkDate > date2){
                    endChunkDate = date2
                }
                diff-=chunkSize
                dateRanges.push({start: moment(date1).format(format),end: moment(endChunkDate).format(format)})
                date1.setTime(endChunkDate.getTime()+(1000*60*60*24))
                dateString1 = moment(date1).format(format)
            }
            return dateRanges
        }
    };
}();

exports.dateUtils = _dateUtils;