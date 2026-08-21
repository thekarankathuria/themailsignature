# Extract: .demo_section [0] from demo.html

## HTML

```html
<div class="demo_section">
  <div class="padding-section-medium">
    <div class="container-large">
      <div class="view-demo-wrapper">
        <div class="demo-vodeo-gradiant-line">
          <div class="view-demo-content">
            <div class="view-demo-video w-embed w-iframe">
              <div style="position: relative; padding-bottom: 64.5933014354067%; height: 0;">
                <iframe src="https://www.loom.com/embed/76cdf9714c3347efb3e8da04ed85692d?sid=b740996e-7c19-4dc9-a956-4a0d23d400e4" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
              </div>
            </div>
          </div>
          <div class="email-line"></div>
        </div>
      </div>
    </div>
  </div>
</div>
```

## CSS rules (13)

```css
.w-embed:before,.w-embed:after { content:" ";grid-area:1/1/2/2;display:table }
.w-embed:after { clear:both }
.container-large { width:90%;max-width:1400px;margin-left:auto;margin-right:auto }
.padding-section-medium { z-index:-1;padding-top:80px;padding-bottom:80px }
.email-line { justify-content:flex-start;align-items:flex-start;display:flex;position:absolute;inset:0% auto auto 0% }
.view-demo-content { z-index:1;border-radius:20px;position:relative }
.demo-vodeo-gradiant-line { border-radius:20px;position:relative }
.view-demo-wrapper { border:1px solid var(--gray--50);border-radius:20px;padding:4px;overflow:hidden;box-shadow:0 2px 24px #0000001a }
.view-demo-video { border-radius:16px;overflow:hidden }
@media screen and (max-width:991px) {
  .padding-section-medium { padding-top:4rem;padding-bottom:4rem }
}
@media screen and (max-width:767px) {
  .padding-section-medium { padding-top:3rem;padding-bottom:3rem }
}
@media screen and (max-width:479px) {
  .padding-section-medium { padding-top:36px;padding-bottom:36px }
  .view-demo-wrapper { border-color:var(--gray--50) }
}
```
