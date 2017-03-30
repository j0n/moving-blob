var THREE = require('three');

module.exports = {
    dist: function(p1, p2) {
      var a = p1.x - p2.x
      var b = p1.y - p2.y
      return Math.sqrt( a*a + b*b );
    },
    anglePoints: function(p1, p2) {
        return Math.atan2(p2.y-p1.y,p2.x-p1.x);// * 180 / Math.PI;
    },
    sine: function(shape, positions, t, segments) {
        var yAxis = positions[0].y;
        var xAxis = positions[0].x;
        var unit = 0.2;
        var dist =  positions[1].x - positions[0].x;
        var resolution = dist/segments;
        var vectors = [segments+1];

        for (i = 0; i < segments; i++) {
            var num = i * resolution;
            var x = t+(xAxis+num)/unit;
            var y = Math.sin(t+(-yAxis+num)/unit)/2;
            vectors.push(new THREE.Vector3(num, unit*y+yAxis, 0));
        }
        vectors.push(
                new THREE.Vector3(
                    0, unit * Math.sin(t+(-yAxis)/unit)/2+yAxis, 0)
                );
        return vectors;
    },
    cos: function(shape, positions, t, segments) {

        var yAxis = positions[0].y;
        var xAxis = positions[0].x;
        var dist =  positions[1].x - positions[0].x;
        var unit = 1.5;
        var vectors = [segments+1];
        var resolution = dist/segments;

        for (i = 0; i < segments; i++) {
            var num = i * resolution;
            var x = t + (xAxis + num)/unit;
            var y = -Math.sin(x)/2;
            vectors.push(new THREE.Vector3(num, unit*y+yAxis, 0));
        }
        var x = t+(xAxis+0)/unit;
        var y = -Math.sin(x)/2;
        vectors.push(new THREE.Vector3(0, unit*y+yAxis, 0));

        return vectors;
    },
    replacePosition : function(obj, index, _pos) {
        obj.positions[index].x = _pos.x;
        obj.positions[index].y = _pos.y;
    },
    replaceLastPosition : function(obj, _pos) {
        this.replacePosition(obj, obj.positions.length-1, _pos);
    },
    replaceFirstPosition : function(obj, _pos) {
        this.replacePosition(obj, obj.positions[0], _pos);
    },
    getNewAngle: function(angle) {
        return angle + 0.01;
    }

}
