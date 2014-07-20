var enlighten = {qualifiers: [], db: {}};

enlighten.help = function () {
    console.info('Teach me with node("Thing", qualifier, "Thing");')
    console.info('Get my confidence with con("Thing", qualifier, "Thing");')
    console.info('Available qualifiers:', enlighten.qualifiers);
};

// Bidirectional qualifiers
var bi = {
    'is_a': 'attribute_of', // Cat is a mammal. Mammal is an attribute of cat.

    'is_part_of': 'has_a',  // Mouth is part of cat. Cat has a mouth.
    
    'causes': 'caused_by',  // Fire causes burning. Burning is caused by fire.

    'can_cause': 'can_be_caused_by', // Less confident version

    'uses': 'used_for',     // Books are used for education. Education uses books.
    
    'can_use': 'can_be_used_for', // Less confident version
    
    'relates_to': 'relates_to' // Ambiguous relationship
};

Object.keys(bi).forEach(function (key1) {
    var key2 = bi[key1];
    window[key1] = {$fwd: key1, $rev: key2};
    window[key2] = {$fwd: key2, $rev: key1};
    if (enlighten.qualifiers.indexOf(key1) === -1) {
        enlighten.qualifiers.push(key1);
    }
    if (enlighten.qualifiers.indexOf(key2) === -1) {
        enlighten.qualifiers.push(key2);
    }
});

function node () {
    var args = Array.prototype.slice.apply(arguments);
    /**
     * Forward
     */
    var current = args[0];
    var next;
    if (typeof current !== 'string') {
        throw new Error('Must start with a concept (string)');
    }
    if (!enlighten.db[current]) {
        enlighten.db[current] = [];
    }
    current = enlighten.db[current];
    for (var i=1; i < args.length; i++) {
        /**
         * Look for existing qualifier
         */
        var next = false;
        for (var j=0; j < current.length; j++) {
            if (current[j][0] === args[i]) {
                next = current[j][1];
            }
        }
        /**
         * Not found
         */
        if (next === false) {
            next = [];
            current.push([args[i], next]);
        }
        current = next;
    }

    /**
     * Reverse
     */
    var current = args[args.length - 1];
    var next;
    if (typeof current !== 'string') {
        throw new Error('Must end with a concept (string)');
    }
    if (!enlighten.db[current]) {
        enlighten.db[current] = [];
    }
    current = enlighten.db[current];
    for (var i=args.length - 2; i >= 0; i--) {
        /**
         * Look for existing qualifier
         */
        var next = false;
        for (var j=0; j < current.length; j++) {
            if (current[j][0] === args[i]) {
                next = current[j][1];
            }
        }
        /**
         * Not found
         */
        if (next === false) {
            next = [];
            current.push([args[i], next]);
        }
        current = next;
    }
    return JSON.stringify([args[0], enlighten.db[args[0]]]);
};

function con () {
    console.log('Confidence');
};

function why () {
    console.log('Why');
};
