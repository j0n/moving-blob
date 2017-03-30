var THREE = require('three');
var r = 5;
var circle;
var segments = 64; 
module.exports = {
    init: function(scene) {
        var material = new THREE.MeshBasicMaterial({
                color: 0xffffff
        });
        var circleGeometry = new THREE.CircleGeometry( r, segments );              
        circle = new THREE.Mesh( circleGeometry, material );
        scene.add( circle );
    },
    setRadius: function(_r, scene) {
        if (_r !== r) {
            scene.remove(circle);
            r = _r;
            this.init(scene);
        }
    }
}
