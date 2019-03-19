# orca-logo

Vanilla JS animated logo for NCLS Development's Orca solution, as a Web Component.  
See the [live demo](https://ccjmne.github.io/orca-logo).

## Usage

Basic usage:

```lang-html
<orca-logo></orca-logo>
```

Displays the logo. Hover (or tap) it to have it 'shine'.

## Alternate forms

1.  `animated`

    ```lang-html
    <orca-logo animated></orca-logo>
    ```

    When the logo enters the viewport, have it appear by 'drawing' its outline, then fade its fill in and shine.  
    Hover (or tap) it to have it 'shine'.

2.  `animated="spinner"`

    ```lang-html
    <orca-logo animated="spinner"></orca-logo>
    ```

    Runs a looping 'spinner'-like animation conveying a busy state.  
    No mouse/finger interaction.

## Custom styling

Style its primary colour via the CSS variable `--primary-colour`.

## Dependencies

-   None

## Compatibility

-   See [caniuse Custom Elements v1](https://caniuse.com/#feat=custom-elementsv1)
-   See [caniuse IntersectionObserver](https://caniuse.com/#feat=intersectionobserver)

## Installation

Install through `npm`:

    npm install orca-logo

## Licensing

**GNU General Public License v3.0**

Permissions of this strong copyleft license are conditioned on making available complete source code of licensed works and modifications, which include larger works using a licensed work, under the same license.  
Copyright and license notices must be preserved.  
Contributors provide an express grant of patent rights.
