### 作业1 Notes
产生 shadow map 时，一般平行光用正交投影，而点光源用透视投影

泊松圆盘采样效果远好于随机圆盘采样，视觉上的噪声小了很多

PCF 为了实现软阴影，不仅考虑当前点是否被阻挡，还考虑当前点周围的点是否被阻挡了，这样算出一个平均的 visibility 值。那么第一个问题就是如何去寻找周围点，要确定该点所在模型上的周围点是有一些困难的。一个简单的近似是，考虑该点在 shadow map 上的周围点，在 filter radius 较小时，我们近似地认为这里的点就是模型上的周围点。然后采样得到的深度和中心点的实际深度去比，如果这个深度加上一个 bias 还要比中心的实际深度小（这里中心的实际深度减去 bias 可以理解为是我估计的采样点的实际深度的下限）就说明该采样点被遮挡了。这里的 bias 可以正比于中心点法线和光线方向夹角的正弦值（因为夹角越大，这里的深度变化越快），关于 bias 的选择可参考 [自适应Shadow Bias算法](https://zhuanlan.zhihu.com/p/370951892)

PCSS 可以理解为一个自适应的 PCF，从半影的成因出发，自动地选择当前渲染点合适的 PCF 的采样半径（阴影离遮挡物越远，光源面积越大，则半影现象越明显，越应该采用更大的采样半径）。具体来说，针对正交投影，采样半径 $r$ 定义为
```math
r = \frac{luv*(zr - zb)}{zb}
```
其中 $luv$ 是是光源在纹理空间中的半径，即它为光源的半径除以 shadow map 的分辨率，而 $zr$ 是渲染点到光源的距离，$zb$ 是渲染点的阻挡物到光源的距离（这些距离是在世界坐标中），计算 $zb$ 时会在 shadow map 上对渲染点和周围区域进行采样，来计算 $zb$ 的平均值（需要计算 $zb$ 的平均值而不是只使用渲染点在 shadow map 上的深度，是因为半影区域可能不会被产生 shadow map 的光源点遮挡，因此需要找找它周围被产生 shadow map 的光源点遮挡的位置）

而对于透视投影，采样半径定义为
```math
r = \frac{luv*(zr - zb)}{zb} * \frac{znear}{zr}
```
这里 $znear$ 是指产生 shadow map 时选择的近平面到光源点的距离，这里额外的修正来源于透视投影到近平面上时会改变边的宽度（而正交投影则不会），见 [GAMES202-作业1：实时阴影](https://zhuanlan.zhihu.com/p/595039591) 中评论区的讨论

我在实现时使用了固定的 5x5 的 blocker search area，但在 [GAMES202-作业1：实时阴影](https://zhuanlan.zhihu.com/p/595039591) 以及 [Nvidia PCSS Integration](https://developer.download.nvidia.cn/whitepapers/2008/PCSS_Integration.pdf) 中使用了根据光源大小和渲染点到光源的距离的启发式公式 radius = light_size_uv * (zReceiver - NEAR_PLANE) / zReceiver，这个基本的想法就是说，所有 blocker 可能的位置的总共面积，就是面积光源在近平面上的投影面积（以渲染点为中心），然后再除以纹理分辨率就得到了需要采样的面积。注意，这些相似关系的计算都需要在线性的世界坐标系中进行

TODO：如何生成面积光源的 shadow map
