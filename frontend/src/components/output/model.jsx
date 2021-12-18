import React from "react";
import BaseComponent from "../base_component";
import ComponentExample from "../component_example";
import {Helmet} from "react-helmet";

class ModelOutput extends BaseComponent {
  render() {
    // {this.props.value["data"]}

    // javascript to initialize the 3d scene and render the 3d model
    const js = `
        function setupBabylon() {
        var canvas = document.getElementById("renderCanvas");

        var engine = null;
        var scene = null;
        var sceneToRender = null;
        var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
        
        var createScene = function () {
        
            var scene = new BABYLON.Scene(engine);
            scene.createDefaultCameraOrLight();
        
            var base64_model_content = "${this.props.value["data"]}";
            var raw_content = BABYLON.Tools.DecodeBase64(base64_model_content);
            var blob = new Blob([raw_content]);
            var url = URL.createObjectURL(blob);
            BABYLON.SceneLoader.Append("", url, scene, function () { 
                scene.createDefaultCamera(true, true, true);
            }, undefined, undefined, ".glb");
            
            return scene;
        
        };
        
        window.initFunction = async function() {
            
            
        var asyncEngineCreation = async function() {
            try {
            return createDefaultEngine();
            } catch(e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
            }
        }

        window.engine = await asyncEngineCreation();
        if (!engine) throw 'engine should not be null.';
        window.scene = createScene();};
        initFunction().then(() => {sceneToRender = scene        
            engine.runRenderLoop(function () {
                if (sceneToRender && sceneToRender.activeCamera) {
                    sceneToRender.render();
                }
            });
        });

        // Resize
        window.addEventListener("resize", function () {
            engine.resize();
        });
        }
        
        const myTimeout = setTimeout(setupBabylon, 1000);
    `

    if (this.props.value) {
      return (
          <div className="output_model">
            <canvas id="renderCanvas"></canvas>
            <Helmet>
             <script src="https://cdn.babylonjs.com/babylon.js"></script>
             <script>{js}</script>
            </Helmet>
          </div>
      )
    } else {
      return false;
    }
  }
}

class ModelOutputExample extends ComponentExample {
  render() {
    return <div className="output_model_example">{this.props.value}</div>;
  }
}

export { ModelOutput, ModelOutputExample };
