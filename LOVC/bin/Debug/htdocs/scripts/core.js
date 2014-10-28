/**
 * References array
 * @type {Array}
 * @private
 */
var _references = [];

/**
 * Include script into project
 * @param file
 */
function include(/* string */ file){
    _references.push(HOST_URI+"/scripts/"+file);
}

/**
 * Main project function
 * @param callback Call when initialization is complete
 * @returns {null|jQuery|HTMLElement}
 */
function main(callback){
    if(_references.length <= 0)
        return typeof callback === 'function' ? $(callback) : null;
    $.getScript(_references.shift(), function(){main(callback);});
    return null;
}