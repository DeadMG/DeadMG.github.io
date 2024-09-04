const dom = ReactDOMFactories;

const Header = React.createFactory(class extends React.Component {
    render() {
        return dom.div({ style: { width: "100%", background: "#7C7C7C", display: "flex", alignItems: "center", justifyContent: "center" } },
            dom.div({ style: { padding: "20px", fontSize: "30px" } }, 
                dom.a({ href: "index.html" }, "Puppy")));
    }
});

const Content = React.createFactory(class extends React.Component {
    render() {
        return dom.div({ style: { paddingTop: "5px", paddingBottom: "5px", paddingLeft: "15px", paddingRight: "5px" } },
            this.props.children);
    }
});

const Sidebar = React.createFactory(class extends React.Component {
    render() {
        return dom.div({ style: { height: "100%", borderRight: "1px solid #7C7C7C" } },
            this.block("DX12", [
                this.error("not started"),
            ]),
            this.block("DXR", [
                this.link("overview.html", "overview"),
                this.link("bindless.html", "bindless"),
            ]));
    }

    error(text) {
        return this.sidebarItem(dom.span({ style: { color: "red" } }, text));
    }

    block(headerText, links) {
        return dom.div({ style: { paddingBottom: "30px" } },
            this.heading(headerText),
            ...links);
    }

    heading(text) {
        return this.sidebarItem(dom.h3({ style: { margin: 0 } }, text));
    }

    link(src, contents) {
        return this.sidebarItem(dom.a({ href: src }, contents));
    }

    sidebarItem(contents) {
        return dom.div({ style: { display: "flex", justifyContent: "flex-end", paddingTop: "5px", paddingBottom: "5px", paddingLeft: "5px", paddingRight: "15px"  } },
            contents);
    }
});

const App = React.createFactory(class extends React.Component {
    render() {
       return dom.div({ style: { height: "100vh", display: "flex", flexDirection: "column" } },
           dom.div({ style: { flexShrink: 0 } }, Header()),
           dom.div({ style: { flexGrow: 1, display: "flex" } },
               dom.div({ style: { height: "100%", flexBasis: "33%", flexShrink: 0 } }, Sidebar()),
               dom.div({ style: { overflow: "auto" } }, Content({}, this.props.children))));
    }
});

const Main = React.createFactory(class extends React.Component {
    render() {
        return dom.div({}, 
            dom.h2({ style: { margin: 0 } }, "Welcome"),
            dom.span({}, "I'm writing some totally random content about programming and stuff. If you find it useful, that's great."));
    }
});

const DXR = {
    Overview: React.createFactory(class extends React.Component {
        render() {
            return dom.div({}, 
                dom.h2({ style: { margin: 0 } }, "DXR Overview"),
                dom.p({}, "DXR, or DirectX Raytracing, is a component from Microsoft that enables you to access raytracing systems in a device-independent way with DirectX 12. For this we'll assume that you already have some idea of how to use DirectX 12."),
                dom.p({},
                    dom.span({}, "DXR completely bypasses the standard rasterisation pipeline. It is best described as a fancy compute shader setup where the runtime supplies you with some extra capabilities and hardware acceleration. "),
                    dom.span({}, "Some APIs are shared between DXR and compute shaders in addition. Here's a simple description of how the process works.")),
                dom.h3({ style: { margin: 0 } }, "Prepare structures"),
                dom.p({},
                    dom.span({}, "DXR requires two important data structures to operate; acceleration structures, and shader binding tables. Acceleration structures are easy, so we will discuss them first. Unlike the SBT, their contents are abstracted from the "),
                    dom.span({}, "developer, but you can think of them as similar to an octree or BVH. They process the geometry of the scene and produce a structure that can be used to accelerate ray lookups. In order for rays to hit anything, they must be present "),
                    dom.span({}, "in an acceleration structure. Acceleration structures have two levels; top and bottom. Bottom level acceleration structures (BLAS) generally encompass smaller details; for example, one static mesh could have one BLAS. BLAS can be "),
                    dom.span({}, "instanced. Top level acceleration structures (TLAS) are used to encompass the geometries of whole scenes. When first learning DXR the general strategy should be to prebuild BLAS for any static meshes at startup, then build BLAS for "),
                    dom.span({}, "dynamic geometry and a TLAS for the scene every frame. With the TLAS built you can trace some rays.")),
                dom.p({},
                    dom.span({}, "The second structure is a shader binding table. In DXR rays can hit any object in the TLAS, so all shaders for all objects must be present and ready to go. The shader binding table essentially tells the system what shader to launch "),
                    dom.span({}, "and what parameters to supply when a ray intersects any given object. The main downside of the SBT is that it has a fixed structure, but there is no API to build this structure, and any errors in the structure can produce highly "),
                    dom.span({}, "confusing results, such as a black screen, bad performance, device removal, visual artifacts, or all of the above. In theory you could prebuild the SBT, but in practice, your shaders will have per-frame parameters, so you will "),
                    dom.span({}, "rebuild it each frame.")),
                dom.p({},
                    dom.span({}, "Finally, as DXR is a compute API, we must write the raytracing results ourselves to one (or several) UAVs. However you cannot bind back buffer render targets as UAV anymore, so you will need a texture of a suitable type. Considering "),
                    dom.span({}, "the need for image post-processing and associated data buffers, this is in practice no big loss. ")),
                dom.h3({ style: { margin: 0 } }, "DispatchRays"),
                dom.p({},
                    dom.span({}, "Once the SBT and TLAS are prepared, you can launch your rays. This basically just means calling DispatchRays with the number of rays you want and the SBT buffers. Unlike a compute shader note that you do not specify the number of "),
                    dom.span({}, "thread groups or threads directly; you simply specify the ray count. Theoretically there are many schemes you could use, but the simplest thing to do is use Depth=1, and set the width and height as the width and height of the "),
                    dom.span({}, "render target, which gives you 1 ray per output pixel.")),
                dom.h3({ style: { margin: 0 } }, "Image post-processing"),
                dom.p({},
                    dom.span({}, "To get a very high quality image with ray tracing, often thousands of rays per pixel are required. In practice we can only support a few, often only one. The way to handle this is to use probabilistic Monte Carlo methods. This "),
                    dom.span({}, "massively reduces the number of samples required such that the output is in real time, but requires significant image post-processing to clean up the noise which occurs. There are many algorithms dedicated to cleaning up the image "),
                    dom.span({}, "noise. We will discuss some of them here, although I have a lot left to learn. The main advice to give is to learn them in a basic order; bilateral filter, then a-trous, then SVGF, then A-SVGF, then attempt ReBLUR. The papers "),
                    dom.span({}, "describing the more advanced algorithms assume you already know all the context.")),
                dom.h3({ style: { margin: 0 } }, "Finalisation"),
                dom.p({},
                    dom.span({}, "At the end of this process, we have a UAV with our image on it. We can then apply tonemapping, and perhaps AA and other final touchups. Then we can use CopyResource to copy our UAV to the backbuffer and Present. Since virtually all ",
                    dom.span({}, "our resources spend their entire life in UnorderedAccess, there is little need for resource transition barriers for most resources, but we will be needing UAV barriers."))));
        }
    }),
    Bindless: React.createFactory(class extends React.Component {
        render() {
            return dom.div({},
                dom.h2({ style: { margin: 0 } }, "SM 6.6 Bindless"),
                dom.p({},
                    dom.span({}, "DXR benefits highly from using Shader Model 6.6's new Bindless feature. This is because of the way that the SBT is built; it must contain all parameters for all shaders. It's possible to use legacy binding here, but considerably more "),
                    dom.span({}, "painful. Bindless resources are very simple to use. We create one SHADER_VISIBLE descriptor heap with a large number of entries, say, 100,000. Then we place all resources in this descriptor heap. We then pass the offset to the shader, "),
                    dom.span({}, "which can read the resource. This means all shaders accept exactly one constant buffer as their only direct parameter, which is very easy to handle. See example HLSL below:"),
                dom.pre({}, `struct FilterParameters
{
    uint ImageWidth;
    uint ImageHeight;
        
    uint InputDataIndex;
    uint InputTextureIndex;
    uint OutputTextureIndex;
};

ConstantBuffer<FilterParameters> Parameters : register(b0);

[numthreads(32, 32, 1)]
void compute(int2 id: SV_DispatchThreadID)
{
    RWStructuredBuffer<RaytracingOutputData> inputData = ResourceDescriptorHeap[Parameters.InputDataIndex];
    RWTexture2D<float4> input = ResourceDescriptorHeap[Parameters.InputTextureIndex];
    RWTexture2D<float4> output = ResourceDescriptorHeap[Parameters.OutputTextureIndex];
    
    int2 dimensions = int2(Parameters.ImageWidth, Parameters.ImageHeight);
    
    if (any(id >= dimensions))
        return;
    
    RaytracingOutputData rtData = inputData[index(id, Parameters.ImageWidth)];
    
    output[id] = input[id] * asFloat(rtData.Albedo) + asFloat(rtData.Emission);
}`)),
                dom.p({},
                    dom.span({}, "To allow this, we need to set a root signature. DXR and Compute shaders have different requirements here. For DXR, use SetComputeRootSignature with a global root signature with no parameters and the "),
                    dom.span({}, "D3D12_ROOT_SIGNATURE_FLAG_CBV_SRV_UAV_HEAP_DIRECTLY_INDEXED flag. The root constant parameters for each shader you invoke with DXR will come from the SBT so there's no need to worry about them on the global signature. "),
                    dom.span({}, "For compute shaders, you will need one parameter for the root constants; this is where we will pass the offsets for each resource. Use the D3D12_ROOT_SIGNATURE_FLAG_CBV_SRV_UAV_HEAP_DIRECTLY_INDEXED flag again. ")),
                dom.p({},
                    dom.span({}, "Once the root signature has been set, use SetDescriptorHeaps to set the heap you placed your resources in. You do not need to use SetComputeRootDescriptorTable, but if you are using a Compute shader, don't forget to "),
                    dom.span({}, "call SetComputeRoot32BitConstants to set your root constants with the resource offsets in them. Once you have a descriptor heap and suitable root signature set, this is all that's needed to access resources without "),
                    dom.span({}, "requiring any root signature binding.")));
        }
    }),
};
