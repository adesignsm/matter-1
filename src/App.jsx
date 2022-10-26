import React from "react";
import Matter, {Bodies, Engine, Render, World} from "matter-js";
import { useEffect, useRef } from "react";

import "./style.css";

const App = () => { 
    const scene = useRef();
    const engine = useRef(Engine.create({enableSleeping: true}));

    const matterWidth = window.innerWidth, matterHeight = window.innerHeight;
    const colors = ["#1F51FF"];

    let mouseIsDown = false;
    let body;
    

    const init = () => {
        const render = Render.create({
            element: scene.current,
            engine: engine.current,
            options: {
                width: matterWidth,
                height: matterHeight,
                background: "#000",
                wireframes: false
            }
        });
        let boundaryGround = Bodies.rectangle(0, window.innerHeight, window.innerWidth * 2, 20, {
            isStatic: true,
            render: {
                fillStyle: "transparent",
            }
        })

        boundaryGround.name = "boundary-ground";

        console.log(boundaryGround);

        //ADD BODIES TO SCENE
        World.add(engine.current.world, [boundaryGround]);

        //RENDER BODIES
        const createBody = (e) => {
            body = Bodies.circle(e.clientX, e.clientY, 25, {
                isStatic: false,
                render: {
                    fillStyle: colors[0]
                },
            })

            World.add(engine.current.world, [body]);
        }

        window.onmousedown = () => mouseIsDown = true;
        window.onmouseup = () => mouseIsDown = false;
        window.onmousemove = (e) => {if (mouseIsDown) {createBody(e);}}

        //CHECK FOR isSLEEPING
        const checkIfAsleep = () => {
            let worldBodies = engine.current.world.bodies;
            if (worldBodies) {
                for (let i = 0; i < worldBodies.length; i++) {
                    if (worldBodies[i].isSleeping === true && worldBodies[i].name !== "boundary-ground") {
                        // worldBodies[i].render.fillStyle = "#000";
                        Matter.Composite.remove(engine.current.world, worldBodies[i]);
                    } else if (worldBodies[i].isSleeping === false && worldBodies[i].name !== "boundary-ground") {
                        worldBodies[i].render.fillStyle = colors[0];
                    }
                }
            }

            // console.log(worldBodies);
        }

        setInterval(() => {
            checkIfAsleep();
        }, 500);

        //RUN THE SCENE
        Engine.run(engine.current);
        Render.run(render);
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <>
            <div id = "matter-container" ref = {scene} style = {{width: "100vw", height: "100vh"}}></div>
        </>
    )
}

export default App;