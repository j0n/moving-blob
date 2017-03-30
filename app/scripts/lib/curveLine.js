var THREE = require('three');
var Helper = require('./draw');
var MAX_POINTS = 300;

var lines = [];
var yod = {
    seconds: 0,
    t: 0
};
var lastFadedIndex = 0;
var _segments = 35;
var hsl = {
    h: 10,
    s: 75,
    l: 50
}

module.exports = {
    addLine : function(_pos, scene, _color, _opacity) {

        var pos = {x: _pos.x, y: _pos.y};
        //shape.currentPath.shape.closed = false;
        pos.y = pos.y + 0.0005;
        pos.x = pos.x + 0.0005;

        var group = new THREE.Group();
        group.position.y = 0;
        scene.add( group );


        for (var i = 0; i < 1; i++) {
            var obj = new THREE.Line( new THREE.Geometry(), new THREE.LineBasicMaterial({
                color: 'hsl('+hsl.h+', '+hsl.s+'%, '+hsl.l+'%)',// _color || 0x000009,
                opacity: _opacity || 0.15,
                transparent: true,
                linewidth: 1,
                fog: true,
                blending: 'SubtractiveBlending'
            }));
            hsl.h += 10;
            // hsl.l += 1;
            group.add(obj);
        }
        group.rotation.z = _pos.rotation || 0;

        lines.push({
            parent: group,
            segments: _segments,
            positions: [_pos, pos],
        });
    },
    replaceLastPosition: function( _pos, index) {
        var  _index = typeof index === 'undefined' ? lines.length-1 : index;
        var activeLine = lines[_index];
        Helper.replaceLastPosition(activeLine, _pos);
    },
    draw: function () {
        yod.seconds = yod.seconds - 0.007;
        yod.t = yod.seconds * (Math.PI * 2); // frecuency
        for (var i = 0, ii = lines.length; i < ii; i++) {
            var line = lines[i]
            var shapes = line.parent.children;
            var pos = line.positions;
            var lineSegments = line.segments;
            for (var j = 0, jj = shapes.length; j < jj; j++) {
                // if ((j % 2) === 0) {
                    shapes[j].geometry.vertices = Helper.cos(shapes[j], pos, yod.t + j, lineSegments);
                    shapes[j].geometry.verticesNeedUpdate = true;
                // }
                // else {
                //     shapes[j].geometry.vertices = Helper.sine(shapes[j], pos, yod.t + j, lineSegments);
                    //shapes[j].geometry.verticesNeedUpdate = true;
                // }
            }
        }
    },
    lesserSegements: function() {
         if (_segments > 5) {
             _segments -= 5;
         }
    }


}
