// 출처 : https://gaybee.tistory.com/29
const arr = ['A', 'B'];
var count = 1;

var result = [];

// 중복 순열
export const makeOverlabPermutation = (r, temp, current) => {
    if(r==current) {
        print(temp);
        result.push(temp);
    } else {
        for(var i=0; i<arr.length; i++) {
            temp[current] = arr[i];
            makeOverlabPermutation(r, temp, current+1, i);
        }
    }
}

const print = (arr) => {
    var str = '';
    for(var i=0; i<arr.length; i++) {
        str += arr[i];
    }
    console.log(count++,' ', str);
}