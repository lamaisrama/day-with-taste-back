// 출처 : https://bcp0109.tistory.com/14
export const permutation = (arr, depth, n, r) => {
    if(depth == r) {
        print(arr, r);
        return;
    }

    for(var i=depth; i<n; i++) {
        swap(arr, depth, i);
        permutation(arr, depth+1, n, r);
        swap(arr, depth, i);
    }
}

export const swap = (arr, depth, i) => {
    var temp = arr[depth];
    arr[depth] = arr[i];
    arr[i] = temp;
}

export const print = (arr, r) => {
    var str = '';
    for(var i=0; i<r; i++) {
        str += arr[i];
    }
    console.log(str);
}