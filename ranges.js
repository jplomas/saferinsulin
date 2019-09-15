var currentBloodGlucoseMin = 31;
var currentBloodGlucoseMax = 300;
var previousBloodGlucoseMin = 31;
var previousBloodGlucoseMax = 300;
var currentInsulinRateMin = 0;
var currentInsulinRateMax = 150;

for (var i = currentBloodGlucoseMin; i < currentBloodGlucoseMax + 1; i++) {
    for (var j = previousBloodGlucoseMin; j < previousBloodGlucoseMax + 1; j++) {
        for (var k = currentInsulinRateMin; k < currentInsulinRateMax + 1; k++) {
            console.log(i / 10 + ',' + j / 10 + ',' + k / 10)
        }
    }
}