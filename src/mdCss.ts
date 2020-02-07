const mdCss = `
h1 {
    font-size: 2.2em;
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 4px;
}

h2, h3, h4, h5, h6 {
    line-height: 1.5em;
    margin-top: 2.2em;
    margin-bottom: 4px;
}

h2 {
    font-size: 1.4em;
    margin: 40px 10px 20px 0;
    padding-left: 9px;
    border-left: 6px solid #ff7e79;
    font-weight: 700;
    line-height: 1.4;
}

h3 {
    font-weight: 700;
    font-size: 1.2em;
    line-height: 1.4;
    margin: 10px 0 5px;
    padding-top: 10px;
}

h4 {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 1.1em;
    line-height: 1.4;
    margin: 10px 0 5px;
    padding-top: 10px
}

h5, h6 {
    font-size: .9em;
}

h5 {
    font-weight: bold;
    text-transform: uppercase;
}

h6 {
    font-weight: normal;
    color: #AAA;
}

img {
    width: 100%;
    border-radius: 5px;
    display: block;
    margin-bottom: 15px;
    height: auto;
}

dl, ol, ul {
    margin-top: 12px;
    margin-bottom: 12px;
    padding-left: 2%;
    line-height: 1.2;
}

p {
    margin: 0 0 20px;
    padding: 0;
    line-height: 1.5;
}

a {
    color: #f22f27;
    text-decoration: none;
}

a:hover {
    color: #f55852;
    text-decoration: underline;
}

a:focus {
    outline-offset: -2px;
}

blockquote {
    font-size: 14px;
    font-style: normal;
    padding: 30px 38px;
    margin: 0 0 10px;
    position: relative;
    line-height: 1.2;
    text-indent: 0;
    border: none;
    color: #888;
}

strong, dfn {
    font-weight: 700;
}

em, dfn {
    font-style: italic;
    font-weight: 400;
}

del {
    text-decoration: line-through;
}

pre,
code {
    font-size: 14px;
    font-family: Roboto, 'Courier New', Consolas, Inconsolata, Courier, monospace;
}

pre {
    display: block;
    background-color: #f6f8fa;
}

p code {
    background-color: #f6f8fa;
}

figure {
    margin: 1em 0;
}

figcaption {
    font-size: 0.75em;
    padding: 0.5em 2em;
    margin-bottom: 2em;
}

figure img {
    margin-bottom: 0px;
}

hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
}

ol p, ul p {
    margin-bottom: 0px;
}

li {
    margin-bottom: 10px;
    margin-top: 10px;
}

table {
    word-break: initial;
    display: block;
    overflow: auto;
    width: 100%;
}

table tr {
    border-top: 1px solid #dadfe6;
    margin: 0;
    padding: 0;
}

table th {
    border: 1px solid #dadfe6;
    text-align: left;
    margin: 0;
    padding: 6px 13px;
}

table td {
    border: 1px solid #dadfe6;
    text-align: left;
    margin: 0;
    padding: 6px 13px;
}
`

export default mdCss
