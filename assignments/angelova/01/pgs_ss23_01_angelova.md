---
layout: default
title: Session
nav_exclude: true
---

**Procedural Generation and Simulation**


Prof. Dr. Lena Gieseke \| l.gieseke@filmuniversitaet.de  
Teaching Assistant: Sylvia Rybak \| sylvia.rybak@filmuniversitaet.de

---
# Session 01 - Introduction (20 points)

This session is due on **Monday, April 24** and we will discuss the results on Wednesday, April 26. 

* [Session 01 - Introduction (20 points)](#session-01---introduction-20-points)
    * [Syllabus](#syllabus)
        * [Task 01.01](#task-0101)
    * [Introduction](#introduction)
        * [Task 01.02 - Procedural Generation](#task-0102---procedural-generation)
    * [Patterns](#patterns)
        * [Task 01.03 - Seeing Patterns](#task-0103---seeing-patterns)
        * [Task 01.04 - Understanding and Implementing Patterns](#task-0104---understanding-and-implementing-patterns)
        * [Task 01.05 - Seeing Faces](#task-0105---seeing-faces)
    * [Abstraction](#abstraction)
        * [Task 01.06 - Abstraction in Art](#task-0106---abstraction-in-art)
        * [Task 01.07 - Abstracted Artistic Expression in CGI](#task-0107---abstracted-artistic-expression-in-cgi)
    * [Unreal Engine](#unreal-engine)
        * [Task 01.07 - First Steps](#task-0107---first-steps)
    * [Learnings](#learnings)
        * [Task 01.08](#task-0108)


## Syllabus

* Read the [Syllabus](../../index.md).

### Task 01.01

* Which of the chapter topics given in the syllabus are of most interest to you? Why?
    - I am looking forward to both the underlying principles and rules of the procedural algorithms, as well as the design topics. I believe that the first one can help me to easier recognize obvious and not so obvious patterns and give me the understanding of how to represent them. Moreover, I am also very excited about the specific design of different patterns, therefore I am looking forward to the Function Design, Islamic Design and the Properties topics.  
* Are there any further topics in regard to procedural generation and simulation that would interest you? 
    - Further topics I would like to learn more about are for example - procedural generation for the game world as well as procedural generation for movies. 
* Which tool would you personally prefer to use for the practical tasks (e.g. Houdini, Unreal, Unity, Maya, Blender, JavaScript, p5, GLSL, ...)?
    - I am mostly interested in working with *Houdini*, *Unreal* and *Blender*. The first two are absolutely new to me, therefore I would love to gain some knowledge and experience working with either of the two. Blender is also another very fascinating software that I recently started learning, so if it is a suitable option for the course, I would be happy to explore it. 
* How would you rate your level of experience with Unreal Engine? 
    * [x] Novice 
    * [ ] Intermediate
    * [ ] Advanced
    * [ ] God-like


## Introduction

* Recap [Chapter 01 - Introduction](../../02_scripts/pgs_ss22_01_intro_script.md)

###  Task 01.02 - Procedural Generation

Briefly in your own words: how would you explain your nanny what *procedural generation* means? 

Procedural generation is when we give our computer a set of rules and some initial information, usually in the form of numbers, and tell it how to use them in order to produce, let's say, a pattern. It is powerful, because we do not need to show our computer any other data in order for it to create the results we want. However, we do need to carefully guide it on how to exactly use these rules.
For example, if we would tell our computer to embroider a straight line with the back stitch, we need to provide it first with an *initial length* of the stitch, and then with the *recipe* - each following stitch starts where the previous one has ended. 

## Patterns

### Task 01.03 - Seeing Patterns

Natural patterns

<img src="img/mushrooms-harz.jpg" alt="Mushrooms from Harz" width=200> <img src="img/barbarossa-cave.jpg" alt="Barbarossa cave" width=200> <img src="img/tree.jpg" alt="Tree" width=200>

Man-made patterns

<img src="img/door-detail.jpg" alt="Door detail" width=200> <img src="img/textile-detail.jpg" alt="Textile detail" width=200> <img src="img/cardboard-detail.jpg" alt="Cardboard detail" width=200>

### Task 01.04 - Understanding and Implementing Patterns

My idea for the generating algorithm is inspired by the mushrooms from the first picture of the natural patterns. I see them as formed from layers of half circles with different radius sizes, where the bigger the radius of the layer, the more curly/ curved the line describing this circle is. The key parameter on which this generation depends is the radius `r`. 

<img src="img/mushroom-1.png" alt="Simple mushroom" width=400> <img src="img/mushroom-0.png" alt="Complex mushroom" width=400>

The first image shows a simple mushroom with a smaller number of layers, the second one - a more complex mushroom. 

`On a personal note:` In the beginning of the month me and my boyfriend were in Harz to celebrate my birthday and during our walks in the nature I took a lot of photos of the mushrooms there, which I found very fascinating, and wanted to either draw them or somehow represent them. Therefore, I thought that this task is the perfect opportunity to do this. I personally decided to spent more time on it, because I really enjoyed it. Since the code is a bit longer, here I am showing the main function, which is creating the mushrooms. The rest of the code is in the `mushroom-pattern` folder. 

```javascript
function mushroomLayer(r, steps, natureness, color) {
    const yMinRange = -natureness/2;
    const yMaxRange = 1 + natureness/2;
    // position each layer at the center of the bottom canvas edge 
    const offset = (width - 2*r) / 2;

    fill(color);

    beginShape();
    for (let i = 0; i < steps; i++) {
        let step = i * PI/(steps-1);
        const isBoundary = i == 0 || i == steps-1;

        let x_t = cos(step);
        let y_t;
        if (isBoundary) {
            y_t = yMinRange;
        }
        else {
            y_t = sin(step) + random(-(natureness/2), natureness/2);
        }

        let x = offset + map(x_t, -1, 1, 0, 2) * r;
        let y = offset + map(y_t, yMinRange, yMaxRange, 1, 0) * r;
        
        curveVertex(x, y);
        if (isBoundary) {
            // curveVertex does not draw boundary vertices,
            // resulting in a crooked bottom line :(
            curveVertex(x, y);
        }
    }
    endShape();
}
```

### Task 01.05 - Seeing Faces

<img src="img/wall-friend.jpg" alt="Wall friend" width=200> <img src="img/grumpy-forest-face.jpg" alt="Grumpy face" width=200> <img src="img/nice-face.jpg" alt="Nice guy" width=200>

## Abstraction

### Task 01.06 - Abstraction in Art

![A Sunday on La Grande Jatte, Georges Seurat, 1884](img/a-sunday-on-la-grande-Jatte.jpg)

I am a huge fan of both the Impressionism and the following Neo-Impressionism art movements, because of their main focus on color, light and form. For me personally, this visual emphasize makes the artworks appear lively and vibrant - I am not just their observer, but more like a part of them. For instance, I can easily feel the weather and the sunlight depicted, or hear the sounds of the surrounding. Thus, here I chose *A Sunday on La Grande Jatte* by George Seurat as an inspirational painting for me. I recently watched a video about the history of this painting from one of my favorite YouTube channels [Great art explained](https://www.youtube.com/watch?v=AJr2T1ko3Is) and learned some very interesting facts about his work - for example, Seurat had a scientific approach to his artworks, trying to find an optical formula for his paintings, and was greatly inspired by the color theories of Michel Eugène Chevreul, especially the fact that color is influenced by the surrounding its colors. I find this attention to color details very inspirational and as a result, I notice that I pay more attention to the colors and light effects around me. Moreover, I am inspired to learn further about their influence on us, and therefore to make more conscious color choices when creating.

### Task 01.07 - Abstracted Artistic Expression in CGI

![Pleasant Places, Quayola, 2015](img/pleasant-places-11.jpg)
I really liked the works of Quayola, presented in the lecture, therefore I did further research on the artist and the type of art he creates. I think that one reason I find his works very appealing are his inspirations - classical sculptures, Old Master paintings and Baroque architecture, as described in his Bio, which are all aesthetics that I am also keen on and motivated by. Moreover, I am drawn to his works because of their subject, which in most of the cases is the nature. Thus, I am fascinated by the way he manages to capture and represent something so natural with the means of technology without taking away its naturalness and liveliness. Furthermore, despite the complex depiction, I still feel that there is some kind of raw feeling to his work, which I also really like. 

## Unreal Engine

### Task 01.07 - First Steps

![My first scene in Unreal Engine 5](img/ue5-mushrooms-first-scene.png)
For creating this scene, I watched the official tutorials on the Unreal Engine website and some additional beginner tutorials on YouTube. I used assets from the Megascan collection on Quixel and some simple lighting and camera settings, trying to represent a close-up shot somewhere in the forest. 

## Learnings

### Task 01.08

I liked the broad overview of approaches, because it is an exciting first impression of what the course will later focus on. Moreover, I also enjoyed the fact that there were many examples of different art pieces - starting from the traditional ones and going to the modern CGI abstract works. It helped me to gain a better understanding of what possible design interpretations and goals one can approach and achieve with the help of procedurally generated patterns. What I found challenging was to take my understanding of patterns to a more abstract level. This would help me to recognize also not so trivial patterns and create recipes for generating more complex visuals with them. Furthermore, I believe that Unreal Engine would be another big challenge (possitively), because it does offer so many possibilities on one hand, and on the other until now I have not found many contents specifically on the topic of using it for procedural generation.  

---
