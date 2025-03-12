# My Tetris

This is a web-based Tetris game built using HTML, CSS, and JavaScript. The game includes features such as scoring, levels, next piece preview, and sound effects.

## Project Structure

```
html_server.js
index.html
my_tetris.js
style.css
audio/
    clear.wav
    gameover.wav
    TetrisThemeMusic.ogg
images/
    background.jpg
    background1.jpg
    background2.jpg
    background3.jpg
    background4.jpg
```

- `html_server.js`: Node.js server script to serve the HTML, CSS, JavaScript, and media files.
- `index.html`: Main HTML file for the Tetris game.
- `my_tetris.js`: JavaScript file containing the game logic.
- `style.css`: CSS file for styling the game.
- `audio/`: Directory containing audio files for game sounds.
- `images/`: Directory containing background images for the game.

## Getting Started

### Prerequisites

- Node.js installed on your machine.

### Running the Server

Start the Node.js server to serve the game files:
```sh
node html_server.js
```

The server will start on `http://0.0.0.0:8080`. Open this URL in your web browser to play the game.

## Game Controls

- **Arrow Left**: Move piece left
- **Arrow Right**: Move piece right
- **Arrow Up**: Rotate piece
- **Arrow Down**: Soft drop
- **Space**: Hard drop

## Features

- **Scoring**: Earn points by clearing lines.
- **Levels**: Increase the level and speed by clearing lines.
- **Next Piece Preview**: See the next pieces in the queue.
- **Sound Effects**: Background music and sound effects for line clears and game over.
- **Responsive Design**: The game is responsive and works on different screen sizes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Tetris © 1985~2024 Tetris Holding.
- Tetris logos, Tetris theme song, and Tetriminos are trademarks of Tetris Holding.
- Tetris Game Design by Alexey Pajitnov. Tetris Logo Design by Roger Dean. All Rights Reserved.