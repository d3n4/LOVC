function $l(word){
    var tmp = $l.words[word];
    return typeof tmp === "string" ? tmp : word;
}
$l.words = {};