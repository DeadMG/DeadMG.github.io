const dom = ReactDOMFactories;

const Header = React.createFactory(class extends React.Component {
    render() {
        return dom.div({ style: { width: "100%", background: "#7C7C7C", display: "flex", alignItems: "center", justifyContent: "center" } },
            dom.div({ style: { padding: "20px", fontSize: "30px" } }, 
                dom.a({ href: "index.html" }, "Puppy")));
    }
});

const dxrLinks = [
    { html: "overview.html", text: "overview" },
    { html: "agility.html", text: "agility" },
    { html: "bindless.html", text: "bindless" },
    { html: "raygen.html", text: "raygen" },
    { html: "closesthit.html", text: "closest hit" },
    { html: "miss.html", text: "miss" },
    { html: "pipelinestate.html", text: "pipeline state" },
    { html: "accelerationstructures.html", text: "acceleration structures" },
    { html: "sbt.html", text: "SBT" },
    { html: "dispatchrays.html", text: "dispatch rays" },
    { html: "reflection.html", text: "reflection" },
];

const Content = React.createFactory(class extends React.Component {
    render() {
        return dom.div({ style: { paddingTop: "5px", paddingBottom: "5px", paddingLeft: "15px", paddingRight: "5px", width: "calc(100% - 20px)" } },
            dom.div({}, this.props.children),
            dom.div({ style: { paddingTop: "20px", width: "100%" } }, 
                this.renderLinks()));
    }

    renderLinks() {
        const dxrIndex = dxrLinks.findIndex(item => window.location.pathname.endsWith(item.html));
        if (dxrIndex == -1) return null;

        const previousItem = dxrLinks[dxrIndex - 1];
        const nextItem = dxrLinks[dxrIndex + 1];

        return dom.div({ style: { display: "flex", width: "100%" } },
            previousItem && dom.div({}, dom.a({ href: previousItem.html }, previousItem.text)),
            dom.div({ style: { marginLeft: "auto" }}),
            nextItem && dom.div({}, dom.a({ href: nextItem.html }, nextItem.text)));
    }
});

const Sidebar = React.createFactory(class extends React.Component {
    render() {
        return dom.div({ style: { height: "100%", borderRight: "1px solid #7C7C7C" } },
            this.block("DX12", [
                this.error("not started"),
            ]),
            this.block("DXR", dxrLinks.map(l => this.link(l.html, l.text))));
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
                dom.div({ style: { height: "100%", flexBasis: "25%", flexShrink: 0 } }, Sidebar()),
                dom.div({ style: { overflowY: "auto", flexGrow: 1 } }, Content({}, this.props.children)),
                dom.div({ style: { flexBasis: "10%", flexShrink: 0 } })));
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
                dom.p({}, `DXR, or DirectX Raytracing, is a component from Microsoft that enables you to access raytracing systems in a device-independent way with DirectX 12. For this we'll assume that you already have some idea of how to use DirectX 12. DXR completely 
bypasses the standard rasterisation pipeline. It is best described as a fancy compute shader setup where the runtime supplies you with some extra capabilities and hardware acceleration. Some APIs are shared between DXR and compute shaders in addition. Here's a simple 
description of how the process works.`),
                dom.h3({ style: { margin: 0 } }, `Prepare pipeline state`),
                dom.p({}, `Similar to rasterisation, raytracing requires a pipeline state. This provides some configuration including all the shaders that will be used. DXR has five types of shaders; raygen, any hit, closest hit, intersection, and callable. For basic 
functionality we only require raygen, closest hit, and miss. The raygen shader is essentially the entry point of the system; it is invoked to fire the starting rays. Closest hit shaders are invoked when the ray hits an opaque target, and defines their lighting and other 
characteristics. Miss shaders are used for backgrounds, etc where the ray does not hit any geometry. DXR has two types of root signature; a global root signature (the default) applies to the entire system, and each shader has its own local root signature, specified by 
passing in the D3D12_ROOT_SIGNATURE_FLAG_LOCAL_ROOT_SIGNATURE flag when creating it. Usually the global root signature should be empty so that you can treat each shader individually. Preferably we create the pipeline state one time at startup and never touch it thereafter.`),
                dom.h3({ style: { margin: 0 } }, "Prepare structures"),
                dom.p({}, `DXR requires two important data structures to operate; acceleration structures, and shader binding tables. Acceleration structures are a spatial data structure used to look up scene contents quickly when tracing rays, similar to an 
octree, and shader binding tables tell the GPU what shaders to invoke when generating rays, hitting objects, or missing them. Acceleration structures for static geometry can be prebuilt and re-used, but dynamic geometry and scene-wide structures must be built every frame.
The SBT also must be rebuilt each frame.`),
                dom.h3({ style: { margin: 0 } }, "Call DispatchRays"),
                dom.p({}, `DispatchRays is essentially a Dispatch call of the raygen shader. The raygen shader then spawns rays which do or don't hit things, invoking other shaders as appropriate. Note that as DXR is a compute API, we must write the raytracing results ourselves to one 
(or several) UAVs. However you cannot bind back buffer render targets as UAV anymore, so you will need a texture of a suitable type. Considering the need for image post-processing and associated data buffers, this is in practice no big loss. `),
                dom.h3({ style: { margin: 0 } }, "Image post-processing"),
                dom.p({}, `To get a very high quality image with ray tracing, often thousands of rays per pixel are required. In practice we can only support a few, often only one. The way to handle this is to use probabilistic Monte Carlo methods. This massively reduces
the number of samples required such that the output is in real time, but requires significant image post-processing to clean up the noise which occurs. There are many algorithms dedicated to cleaning up the image noise. We will discuss some of them here, although I have 
a lot left to learn. The main advice to give is to learn them in a basic order; bilateral filter, then a-trous, then SVGF, then A-SVGF, then attempt ReBLUR. The papers describing the more advanced algorithms assume you already know all the context.`),
                dom.h3({ style: { margin: 0 } }, "Finalisation"),
                dom.p({}, `At the end of this process, we have a UAV with our image on it. We can then apply tonemapping, and perhaps AA and other final touchups. Then we can use CopyResource to copy our UAV to the backbuffer and Present. Since virtually all our resources
spend their entire life in UnorderedAccess, there is little need for resource transition barriers for most resources, but we will be needing UAV barriers.`),
                dom.h2({ style: { margin: 0 } }, "Before starting"),
                dom.p({}, `There's three investments I wish I made before getting started with DXR. These are Agility SDK, SM6.6 bindless and shader reflection. You don't have to do them, but it sure makes life a lot easier. Agility and SM6.6 are very easy to do and 
practically mandatory for having a good developer experience with DXR, so I'd recommend doing them right away. Shader reflection costs more time to set up and requires messing around with the build system, but can save you a ton of time from having to investigate bugs due 
to bad shader bindings. You can tackle this later on.`));
        }
    }),
    Agility: React.createFactory(class extends React.Component {
        render() {
            return dom.div({},            
                dom.h2({ style: { margin: 0 } }, "Agility SDK"),
                dom.p({}, `By default, D3D12 is versioned with Windows, and only updated when the OS is updated. This means, especially if also targetting Windows 10, you may be using a significantly out-of-date version of D3D12. The Microsoft-provided resolution to this
is the `, dom.a({ href: "https://devblogs.microsoft.com/directx/directx12agility/" }, "Agility SDK"), `. This is effectively D3D12 as a library; you can download new versions, update them as desired, and ship them with your application. This gives you the opportunity to 
use the latest features and fixes of D3D12 without worrying about Windows version. Some of the features in newer Agility versions are especially useful for DXR, so it's highly recommended to use the latest version.`),
                dom.p({}, `Using the Agility SDK depends on target language. The first task is to obtain the binaries that are required from `, dom.a({ href: "https://www.nuget.org/packages/Microsoft.Direct3D.D3D12" }, "NuGet"), `. If you are in Visual C++ you can 
simply install the package. If you are using some other language, use the Download Package link to download that version of the SDK. Change the extension of .nuget to .zip and extract. The binaries for each platform are in /build/native/bin. These should be copied 
to the build output in some suitable subfolder, e.g. AgilitySDK, and packaged with the executable.`),
                dom.p({}, `After having the binaries available for your application to use at runtime, it's necessary to use the newest interface for creating D3D12 devices, `, 
                    dom.a({ href: "https://microsoft.github.io/DirectX-Specs/d3d/IndependentDevices.html" }, "ID3D12SDKConfiguration1"),
                    `. First call D3D12GetInterface with CLSID_D3D12SDKConfiguration and __uuidof(ID3D12SDKConfiguration1) to obtain the interface. Then call CreateDeviceFactory; the first argument should be the Agility SDK version, e.g. 614. The second argument should be the 
subfolder the binaries are available in, such as "AgilitySDK". The interface ID should be __uuidof(ID3D12DeviceFactory). With the device factory, you can set flags; these broadly correspond to things you could already do with global functions and I'd definitely recommend 
turning on the debug layer during development. GPU-based validation seems to be a bit glitchy at the moment and you can also access it through PIX, so I'd recommend avoiding that for now. After that use CreateDevice on the factory to create your device.`),
                dom.p({}, `To confirm if you have done it right, ensure you are using your latest drivers, then use ID3D12Device::CheckFeatureSupport method with D3D12_FEATURE_SHADER_MODEL setting D3D_SHADER_MODEL_6_6 for the query. You should be able to hit 6.6. `));
        }
    }),
    Bindless: React.createFactory(class extends React.Component {
        render() {
            return dom.div({},
                dom.h2({ style: { margin: 0 } }, "SM 6.6 Bindless"),
                dom.p({},`DXR benefits highly from using Shader Model 6.6's new Bindless feature. This is because of the way that the SBT is built; it must contain all parameters for all shaders. It's possible to use legacy binding here, but considerably more painful. 
Bindless resources are very simple to use. We create one SHADER_VISIBLE descriptor heap with a large number of entries, say, 100,000. Then we place all resources in this descriptor heap. We then pass the offset to the shader which can read the resource. This means all 
shaders accept exactly one constant buffer as their only direct parameter, which is very easy to handle. See example HLSL below:`),
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
}`),
                dom.p({}, `To allow this, we need to set a root signature. DXR and Compute shaders have different requirements here. For DXR, use SetComputeRootSignature with a global root signature with no parameters and the 
D3D12_ROOT_SIGNATURE_FLAG_CBV_SRV_UAV_HEAP_DIRECTLY_INDEXED flag. The root constant parameters for each shader you invoke with DXR will come from the SBT so there's no need to worry about them on the global signature. For compute shaders, you will need one parameter for 
the root constants; this is where we will pass the offsets for each resource. Use the D3D12_ROOT_SIGNATURE_FLAG_CBV_SRV_UAV_HEAP_DIRECTLY_INDEXED flag again.`),
                dom.p({}, `Once the root signature has been set, use SetDescriptorHeaps to set the heap you placed your resources in. You do not need to use SetComputeRootDescriptorTable, but if you are using a Compute shader, don't forget to call 
SetComputeRoot32BitConstants to set your root constants with the resource offsets in them. Once you have a descriptor heap and suitable root signature set, this is all that's needed to access resources without requiring any root signature binding.`));
        }
    }),
    RayGen: React.createFactory(class extends React.Component {
        render() {
            return dom.div({},
                dom.h2({ style: { margin: 0 } }, "RayGen shaders"),
                dom.p({}, `Before we can prepare the pipeline state, we need to have some shaders we can reference with it. The simplest way to understand a raygen shader is that given a pixel location, we need to translate that location into an origin and direction for 
our ray in world space. It's possible to do this with a standard camera matrix. You can unproject the view frustum's close plane corners on the CPU, compute a point on that plane corresponding to that pixel, then fire a ray from the camera's position to that point on the 
plane. Here's some sample HLSL that performs this task.`),
                dom.pre({}, `struct CameraRootConstants
{
    float3 WorldTopLeft;
    float3 WorldTopRight;
    float3 WorldBottomLeft;
    
    float3 Origin;

    uint SceneBVHIndex;
    uint OutputUAVIndex;
};

// Camera parameters
ConstantBuffer<CameraRootConstants> Camera : register(b0);

struct RadiancePayload
{
    float4 Colour;
};

[shader("raygeneration")]
void RayGen()
{
    // Raytracing acceleration structure, accessed as a SRV
    RaytracingAccelerationStructure SceneBVH = ResourceDescriptorHeap[Camera.SceneBVHIndex];
    
    // Get the location within the dispatched 2D grid of work items
    // (often maps to pixels, so this could represent a pixel coordinate).
    uint2 launchIndex = DispatchRaysIndex().xy;
    // 0.5f puts us in the center of that pixel
    float2 pixelCoordinate = launchIndex.xy + 0.5f;
    // The given dimensions are the absolute maximum of the frustum; they are on the boundaries. There's 1 more boundary than there is pixels.
    float2 dims = float2(DispatchRaysDimensions().xy) + 1.0f;
    
    float3 top = (Camera.WorldTopRight - Camera.WorldTopLeft) / dims.x;
    float3 down = (Camera.WorldBottomLeft - Camera.WorldTopLeft) / dims.y;
    
    float3 target = Camera.WorldTopLeft + (top * pixelCoordinate.x) + (down * pixelCoordinate.y);    
        
    // Initialize the ray payload
    
    RadiancePayload payload;
    payload.Colour = float4(0,0,0,0);
    
    RayDesc ray;
    ray.Origin = Camera.Origin;
    ray.Direction = normalize(target - Camera.Origin);
    ray.TMin = 0.01;
    ray.TMax = 10000;
    
    TraceRay(
        SceneBVH,
        0,
        0xFF,
        0,
        0,
        0,
        ray,
        payload);
    
    RWTexture2D<float4> outputTexture = ResourceDescriptorHeap[Camera.OutputUAVIndex];
    outputTexture[launchIndex] = ray.Colour;
}`),
            dom.p({}, `After deciding where the ray should start and head, we then set up our ray payload. This is basically information the ray carries from shader to shader; when we fire a ray, we must supply a non-empty payload (even if it's unused). The most basic 
information we expect is for the hit or miss to supply us with a colour that we then display. Note that the ray payload is bidirectional; we can supply information to whoever the ray hits, and they can write to that payload and modify the structure back for us to read. 
After that we need to describe and fire the ray in HLSL. This is achieved with the RayDesc structure. Origin and Direction are fairly self-explanatory, but TMin and TMax deserve some discussion. In DXR APIs, T refers to distance that the ray has travelled. Due to floating 
point error, it is possible for rays to trigger intersections located directly at the origin. TMin effectively sets a minimum distance the ray must travel before an intersection can be considered. Although self-intersections can be a complicated topic, simply setting a 
relatively small TMin alleviates the issue a fair bit with little effort. TMax also sets a maximum bound, which can be set to infinity if desired.`),
            dom.p({}, `We then call TraceRay to actually trace the ray. This automatically triggers shaders for whatever the ray intersects. When TraceRay returns, we can observe whatever data those shaders put in the ray payload. In this case we simply write the ray 
colour to a UAV. The parameters to TraceRay can be used to tweak tracing, but don't really matter for a tutorial context; we only have one acceleration structure we can set, the next five parameters are always the same, and we just need to care about the payload and 
ray properties.`),
            dom.p({}, `Note that since we transform positions on the camera plane into world space and perform ray tracing there, we basically never use view space or clip/NDC space; virtually everything is done in world space.`));
        }
    }),
    ClosestHit: React.createFactory(class extends React.Component {
        render() {
            return dom.div({},
                dom.h2({ style: { margin: 0 } }, "Closest hit"),
                dom.p({}, `Closest hit shaders are used for lighting, texturing, etc solid objects. The runtime invokes the shader when we hit an object and provides us with the exact hit location. From there it's up to us to calculate what colour to display. Let's look 
at a simple example.`),
                dom.pre({}, `struct ClosestHitRootParameters {
    float3 colour1;
    float3 colour2;
    float3 colour3;
}

ConstantBuffer<ClosestHitRootConstants> Constants : register(b0);

struct TriangleAttributes
{
    float2 bary;
};

float3 barrypolate(float3 barry, float3 in1, float3 in2, float3 in3)
{
    return barry.x * in1 + barry.y * in2 + barry.z * in3;
}

float3 barycentric(float2 bary)
{
    return float3((1.f - bary.x) - bary.y, bary.x, bary.y);
}

struct RadiancePayload
{
    float4 Colour;
};

[shader("closesthit")]
void ObjectRadianceClosestHit(inout RadiancePayload payload, TriangleAttributes attrib) {
    payload.Colour = float4(barrypolate(barycentric(attrib.bary), Constants.colour1, Constants.colour2, Constants.colour3), 1);
}`),
                dom.p({}, `The closest hit function takes two parameters; one is the payload that we modify, and the other is the intersection attributes. The built-in triangle mesh intersection produces barycentric co-ordinates as the attributes; this tells us where the 
intersection takes place on the triangle. We can then interpolate a colour from there. This is similar to what the rasterisation pipeline does when rendering a pixel from vertices. We simply write the result to the colour payload so that the raygen shader can write it 
to a UAV. Later on, due to our need to fill out various feature buffers, we will instead perform this writing from the closest hit shader iteslf. DXR also provides us with a number of intrinsics that report information about the ray; such as WorldRayOrigin() which reports 
the ray's origin, RayTCurrent() which is the distance of the current hit, and WorldRayDirection() which gives us the direction. This gives us an easy formula for the current hit position in world space; WorldRayOrigin() + (RayTCurrent() * WorldRayDirection()).`),
                dom.p({}, `Note that we do not receive any data about vertices, indices, etc by default. It is up to us to bind them as SRVs if reading them is required. DXR offers some intrinsics for this, such as PrimitiveIndex().`));
        }
    }),
    Miss: React.createFactory(class extends React.Component {
        render() {
            return dom.div({},
                dom.h2({ style: { margin: 0 } }, "Miss"),
                dom.p({}, `Miss shaders are invoked when a targetted ray hits nothing at all. We must provide the caller with a colour to write to the UAV. This can be anything from a constant background to a cubemap sample to procedural background generation. Thanks to 
WorldRayDirection() we know where the ray was aiming at; this information can be used to decide texcoords or procedural generation data. In our simple example we will just return a constant colour.`),
                dom.pre({}, `struct MissRootParameters {
    float4 Colour;
}

ConstantBuffer<MissRootParameters> Constants : register(b0);

struct RadiancePayload
{
    float4 Colour;
};

[shader("miss")]
void RadianceMiss(inout RadiancePayload payload) {
    payload.Colour = Constants.colour;
}`));
        }
    }),
    PipelineState: React.createFactory(class extends React.Component {
        render() {
            return dom.div({}, 
                dom.h2({ style: { margin: 0 } }, "Pipeline state"),
                dom.p({}, `Before we can build our pipeline, we need to briefly learn about hit groups. A "hit group" is basically a set of shaders (intersection/closest hit/any hit) that define how the system should handle a ray hitting a given object. They can be 
instanced in the SBT with different parameters as needed, e.g. one shader for all object intersections, instanced with one per instance or one per mesh with suitable parameters. We only need one hit group currently since we only have kind of thing to hit.`),
                dom.p({}, `Now that we have a simple example of all three shaders, it's time to define a DXR pipeline state. For this we call ID3D12Device5::CreateStateObject. The D3D12_STATE_OBJECT_TYPE should be D3D12_STATE_OBJECT_TYPE_RAYTRACING_PIPELINE. The other 
pipeline state is expressed as an array of subobjects of various types. Here's how to set up a simple pipeline:`),
                dom.ol({},
                    dom.li({}, `For each shader you want to invoke, first create a D3D12_STATE_SUBOBJECT_TYPE_DXIL_LIBRARY subobject with the DXIL of that shader and a single D3D12_EXPORT_DESC with the entry point. Second, create a 
D3D12_STATE_SUBOBJECT_TYPE_LOCAL_ROOT_SIGNATURE subobject with the root signature of that shader. Third, create a D3D12_STATE_SUBOBJECT_TYPE_SUBOBJECT_TO_EXPORTS_ASSOCIATION subobject, associating that root signature subobject with the entry point.`),
                    dom.li({}, `Add a D3D12_STATE_SUBOBJECT_TYPE_GLOBAL_ROOT_SIGNATURE subobject with the global root signature.`),
                    dom.li({}, `Add a D3D12_STATE_SUBOBJECT_TYPE_RAYTRACING_SHADER_CONFIG subobject. For now set both MaxAttributeSizeInBytes and MaxPayloadSizeInBytes to 16.`),
                    dom.li({}, `Add a D3D12_STATE_SUBOBJECT_TYPE_RAYTRACING_PIPELINE_CONFIG subobject; since we are not yet using recursive rays, we can set MaxTraceRecursionDepth to 1.`),
                    dom.li({}, `Lastly, we need to define our hit group with a D3D12_STATE_SUBOBJECT_TYPE_HIT_GROUP. Use a type of D3D12_HIT_GROUP_TYPE_TRIANGLES, which means that the driver will handle all intersection for us. The HitGroupExport is the name of the hit 
group, and we will need to refer to this name later when building our SBT. We only are using the closest hit shader, so set the ClosestHitShaderImport to the entry point of your closest hit shader.`),
                ),
                dom.p({}, `Note that the name of the hit group, and functions in shaders, are both called "export" which can be a bit confusing, but they are logically distinct concepts. Therefore I recommend not naming your hit group the same as a shader entry point so 
that it's always clear when you're dealing with which, for example ObjectHitGroup.`));
        }
    }),
    AccelerationStructures: React.createFactory(class extends React.Component {
        render() {
            return dom.div({},
                dom.h2({ style: { margin: 0 } }, "Acceleration Structures"),
                dom.p({}, `Acceleration structures are separated into two categories; bottom-level (BLAS) and top-level (TLAS). BLAS are used for individual pieces of geometry; such as one mesh. These can be prebuilt ahead of time and used indefinitely if the geometry is 
static. They can also be instanced. For each frame, we will build BLAS corresponding to any dynamic geometry. We will also build the TLAS, which effectively contains the entire scene.`),
                dom.p({}, `By default, the SBT and the TLAS contain circular references; the TLAS contains SBT indexes, whereas the SBT contains references to the TLAS as parameters. We will break this up by reserving a single slot in our CBV/UAV/SRV heap for the TLAS. 
We can then set this in the SBT as an SM6.6 bindless shader parameter, without having to actually build the TLAS first. This eliminates the circular reference problem. Then we can accumulate SBT hit groups and TLAS instances at the same time and build both after 
accumulating all.`),
                dom.p({}, `Acceleration structures are built on the GPU. This means that our first step needs to be to upload vertex and index buffers. We only need to upload the vertex positions; other vertex data is not required. However you can upload any vertex 
structure if you intend to use the vertex buffer later, such as an SRV to the closest hit shader. We use this to fill out a D3D12_BUILD_RAYTRACING_ACCELERATION_STRUCTURE_INPUTS. Set the Type to D3D12_RAYTRACING_ACCELERATION_STRUCTURE_BOTTOM_LEVEL. Set DescsLayout to 
D3D12_ELEMENTS_LAYOUT_ARRAY. Set NumDescs to 1 and pGeometryDescs to a single D3D12_RAYTRACING_GEOMETRY_DESC instance. The geometry description should have a Type of D3D12_RAYTRACING_GEOMETRY_TYPE_TRIANGLES, a Flags of D3D12_RAYTRACING_GEOMETRY_FLAG_OPAQUE, and Triangles 
should be filled in. We set Transform3x4 to 0. Set the index format depending on your index data type; this should probably be R16_UInt or R32_UInt. IndexBuffer should point to the index buffer with IndexCount as the number of indices present. The VertexFormat is the 
format of the vertex's position only; not the whole vertex. This should probably be DXGI_FORMAT_R32G32B32_FLOAT. The VertexCount should be the number of vertices. The VertexBuffer's StartAddress should be the location of the first position in the buffer; i.e. the buffer 
start plus the offset in your vertex format to the position. The StrideInBytes should be the size of your vertex format.`),
                dom.p({}, `Having filled out the description of the AS we want, it's time to actually build the thing. Call ID3D12Device5::GetRaytracingAccelerationStructurePrebuildInfo. The out parameter tells us how much GPU memory we are supposed to provide for the 
AS construction. There are two buffers we are supposed to provide; one scratch temporary buffer, and one final result buffer. Both of these can be in the DEFAULT heap as we are never touching them from the CPU. Align these sizes to 256 bytes and make sure to 
pass D3D12_RESOURCE_FLAG_ALLOW_UNORDERED_ACCESS. The scratch buffer can be in the Common state, and the result buffer should be in the RaytracingAccelerationStructure state. Once this is done we can finally call 
ID3D12GraphicsCommandList4::BuildRaytracingAccelerationStructure. We simply pass in the scratch, destination, and existing input descriptions with SourceAccelerationStructureData as 0. Finally, don't forget to use an unordered access barrier on the result buffer.`),
                dom.p({}, `Now that we have a BLAS, we can create a TLAS. We must upload to the GPU a list of the instances we want to include in the TLAS. This is an array of D3D12_RAYTRACING_INSTANCE_DESC. Each BLAS can be instanced as many times as needed. The 
Transform member should be set as the object space to world space transform matrix; note the weird format. Given an existing 4x4 transform matrix, first Transpose it to column-major format if needed, then copy over and simply drop the fourth row. InstanceId is a 24-bit 
value which can be supplied to the hit shader. The system does not interpret this value so as we don't need it, we can simply set this to 0. The InstanceMask is used to ignore certain geometries for certain rays. Since we don't wish this right now, set it to 0xFF. 
Meanwhile set InstanceContributionToHitGroupIndex as the index in the SBT of the hit record that should be used; the next section details building the SBT. We don't need any Flags so lastly set the AccelerationStructure to the virtual address of the BLAS being instanced.
Once we have uploaded all the instances we desire, we can build our D3D12_BUILD_RAYTRACING_ACCELERATION_STRUCTURE_INPUTS. Set the GPU address of the instance buffer as InstanceDescriptions, DescriptorsCount as the number of descriptors, the Layout to Array again, and 
this time, we set the Type to D3D12_RAYTRACING_ACCELERATION_STRUCTURE_BOTTOM_LEVEL. Once the inputs is filled out, proceed with the same process as the BLAS for actually building the AS. This gives us the raytracing structure we need to actually trace some rays.`),
                dom.p({}, `To add a TLAS to the descriptor heap, use ID3D12Device::CreateShaderResourceView with a null resource. Set the D3D12_SHADER_RESOURCE_VIEW_DESC to have a Format of DXGI_FORMAT_UNKNOWN, a ViewDimension of 
D3D12_SRV_DIMENSION_RAYTRACING_ACCELERATION_STRUCTURE, and D3D12_DEFAULT_SHADER_4_COMPONENT_MAPPING as Shader4ComponentMapping. Finally, populate the RaytracingAccelerationStructure member. This is a struct which has only one member- the GPU virtual address of the TLAS.`)
            );
        }
    }),
    SBT: React.createFactory(class extends React.Component {
        render() {
            return dom.div({},
                dom.h2({ style: { margin: 0 } }, "Shader Binding Table"),
                dom.p({},
                    dom.span({}, "In DXR rays can hit any object in the TLAS, so all shaders for all objects must be present and ready to go. The shader binding table essentially tells the system what shader to launch "),
                    dom.span({}, "and what parameters to supply when a ray intersects any given object. The main downside of the SBT is that it has a fixed structure, but there is no API to build this structure, and any errors in the structure can produce highly "),
                    dom.span({}, "confusing results, such as a black screen, bad performance, device removal, visual artifacts, or all of the above. In theory you could prebuild the SBT, but in practice, your shaders will have per-frame parameters, so you will "),
                    dom.span({}, "rebuild it each frame.")),
                dom.p({}, `The SBT itself is three different arrays, but in practice, it's easiest to fold it into a single array. Technically the elements need an alignment of 32 bytes, when each array is aligned to 64 bytes, but it's much more reliable to align every 
element to 64 bytes. So we treat it as one array of elements, each aligned to 64 bytes. We simply need to sort the elements by their type before submitting them. We can use only one raygen shader, and although multiple miss shaders are possible, these are not required. 
This makes building the SBT much easier as we simply write in one raygen record, one miss record, then N hit records.`),
                dom.p({}, `Each SBT element basically identifies the shader and lists the parameters so that the system can invoke it. We 
use the ID3D12StateObjectProperties interface to achieve this. After creating the ID3D12StateObject for your raytracing pipeline state, using QueryInterface to acquire the Properties interface from that. Call GetShaderIdentifier with the entry point of a raygen shader 
or miss shader, or the name of a hit group, to retrieve a pointer to an identifier buffer. This buffer must be of size D3D12_RAYTRACING_SHADER_IDENTIFIER_SIZE_IN_BYTES (32). Copy the data over and then add our root parameters following this and align the size up to 
64bytes. We can add the same hit group several times with different parameters if desired; for example one object shader may take different parameters for different meshes or instances and be added repeatedly for each use.`),
                dom.p({}, `Once we've accumulated the list of entries, we need to actually build the SBT. Since we are probably rebuilding the SBT every frame, you can just allocate it in the Upload heap and leave it there. The SBT should be in state 
NonPixelShaderResource. For each of the three types (raygen, miss, hit group) we need to calculate the maximum element size, as they must be uniformly sized. Then write them into the buffer, padding as needed to hit the size. Don't forget the 64 byte alignment. Once you 
have written them to the buffer, we can fill in the first three properties of D3D12_DISPATCH_RAYS_DESC. Set RayGenerationShaderRecord to the address and size of that one record. Set MissShaderTable to the address, size, and stride of that part of the buffer, and do the 
same for HitGroupTable. Don't worry about callable shaders for now; they are not needed.`));
        }
    }),
    DispatchRays: React.createFactory(class extends React.Component {
        render() {
            return dom.div({},
                dom.h2({ style: { margin: 0 } }, "DispatchRays"),
                dom.p({}, `DispatchRays actually dispatches the system to trace the rays. We already filled out some properties of D3D12_DISPATCH_RAYS_DESC. The other three relate to the dimensions of the dispatch. Unlike Dispatch for compute shaders, the implementation 
controls thread group size; we specify the exact number of rays desired. The easiest way to do this is to use Depth=1 and set width and height to the width and height of the render target. This gives us a simple 1 ray per pixel. After calling DispatchRays don't forget 
to use a UAV barrier on the outputs.`),
                dom.p({}, `For the simple tutorial example, we will immediately copy this on to the back buffer and then Present, which concludes the functionality of the smallest possible DXR sample. We will follow on after this example with a discussion of Monte Carlo 
path tracing and image processing. This does mean that DXR never requires that the back buffer be in the RenderTarget state; rather we transition between Present and CopyDest. Furthermore since we have defined our raygen shader to write to every pixel, we do not need to 
Clear the backbuffer either.`));
        }
    }),
    Reflection: React.createFactory(class extends React.Component {
        render() {
            return dom.div({},            
                dom.h2({ style: { margin: 0 } }, "Shader reflection"),
                dom.p({}, `When using shaders with D3D12 there is often a need for us to supply parameters expected by the shader. However, HLSL's layout rules can be a bit arcane and situation-dependent. Shader reflection solves this issue by reflecting on the target 
shader to produce source code automatically. Originally I tried to skip setting up reflection, but it's just a waste of time to have to look at every HLSL type you use, figure out what you think the result should be, then debug the inevitable very confusing errors when 
it's not. Therefore it's just a good investment to set this up correctly the first time. This involves integrating with the build system you are using, so there will be no specific instructions, but rather just a description of how it should be done.`),
                dom.h3({ style: { margin: 0 } }, "Shader compilation"),
                dom.p({}, `To begin with, the build must consider HLSL files as inputs, i.e. when they change, the build is re-run. Visual Studio employs a fast update check which typically does not include HLSL files. This means you can end up running the application 
with old versions of shaders. I'd recommend making sure that the HLSL files are listed as build inputs, and if using VS, listed as fast update inputs. Secondly to this, you need a build-time tool that compiles HLSL files and spits out code in the language of your choice. 
The built-in VS HLSL tool will not do what is needed. When the tool is invoked, we need to build the shaders with DXC. We can call CreateDxcCompiler to create an IdxcCompiler3. Then call the Compile function. The first parameter must be the HLSL source text of the shader. 
You can load this from disk as part of the build. The next parameter is a list of DXC command line arguments. These are not clearly specified, but it needs to include a few things. The first argument should be the HLSL file name. Then if debugging, we pass in several 
additional arguments; "-Zi", "-Qembed_debug" and "-Od". These basically ensure that shader debugging in PIX and IHV tools will work as expected. Next we pass in the shader model, e.g. "-T lib_6_6" or "-T cs_6_6". If dealing with a compute shader, the entry point 
must be specified. This is a bit of a problem because really, we'd rather find the entry point with reflection which is not possible. Therefore this needs to be based on convention; for example you can have all your compute shaders have an entry point of "main" or 
"compute", or you can search for [numthreads(..)] void function_name to try to load the function name from the source text. Either way, specify the entry point as "-E main" for example. Lastly, you can pass in any additional flags of your choice such as 
-enable-16bit-types.`),
                dom.h3({ style: { margin: 0 } }, `Perform reflection`),
                dom.p({}, `Call IDXCResult::GetOutput with DXC_OUT_KIND::DXC_OUT_REFLECTION expecting an IDXCBlob. We call IDXCUtils::CreateReflection with the reflection blob. If 
reflecting on a DXR shader, use ID3D12LibraryReflection. If reflecting on a compute shader, use ID3D12ShaderReflection. It's not possible to ask the API to figure out what kind of shader you are dealing with, therefore I settled for doing a simple source text search. If 
I find "[numthreads" I'm expecting a compute shader, if I find "[shader(" I'm expecting a DXR shader. If dealing with a DXR shader, we need to find the entry point of the shader. Similar to compute shaders above, you can either use a convention like always using "main", 
or you can use GetDesc. The Desc has a function count which should be 1 if there's one entry point which is what it should be. Then use GetFunctionByIndex(0) and call GetDesc on that. Note however that the description name is the mangled name of the shader, and some 
drivers currently crash when given the mangled name. To unmangle it I simply took the first match of "\\w+".`),
                dom.p({}, `The second task is to find out about the shader's inputs. Due to our choice to use SM 6.6 bindless, it is both a blessing and a curse. The good news is that we do not need to handle reflection on any parameter types other than constant or 
structured buffers. The bad news is that the shader reflection API won't give up the types of structured buffers without a fight. To start with, we can reflect on BoundResources. This is accessible on either ID3D12ShaderReflection for compute shaders, or the 
ID3D12FunctionReflection we got from GetFunctionByIndex for DXR shaders. This lists the resources we bound. Call GetDesc and check the Type member to see if we are dealing with a constant buffer or structured buffer. If we find a cbuffer, call GetVariableByName with the 
name of the bound resource. You can then map the type of that variable. If we find a structured buffer, call GetConstantBufferByName (yep) with the name of the bound resource. Then call GetVariableByIndex(0) to get the structured buffer variable. Now we can map the type 
of that variable. If trying to share code between the compute and DXR shader paths, note that although ID3D12ShaderReflection and ID3D12FunctionReflection share APIs, they do not share any interface, so it may be necessary to wrap them in your own interface for ease of 
use.`),
                dom.p({}, `When mapping types, simple types are easy; the type's GetDesc() produces a description where the Class is D3D_SVC_SCALAR and the Type is something like D3D_SVT_UINT, D3D_SVT_FLOAT, or D3D_SVT_VOID. These map fairly straightforwardly into source 
types. For matrices, you should expect a Class of D3D_SVC_MATRIX_COLUMNS unless you have specified row_major; you can use the ColumnCount and RowCount to decide their width and height. The Type reflects the matrix's element type. For vector types, the Class should be 
D3D_SVC_VECTOR with ColumnCount as the number of elements and Type as the element type, e.g. float3 is Class D3D_SVC_VECTOR ColumnCount 3 Type D3D_SVT_FLOAT. Then we get to structs which are markedly more painful. Each type is not considered to have its own size; the 
containing variable does. This means when deciding the size of a struct, we must pass down the size of the parent variable. This also implies that one HLSL type may have multiple different sizes; HLSL can apply different rules if the type is used in cbuffer or structured 
buffer contexts. We should ensure to produce different source language types in these different cases. Additionally, this works easily for structs that are used directly as a variable, but structs that contain other structs are more complicated because there is no API 
to get the size of a struct member. We can, however, get the offset of a struct member. This means that we can compare the offset to either the total parent size, or the offset of the next member, to figure out the size of the struct (which may include some dead padding). 
Broadly, I would highly recommend not using the same HLSL types in both a constant buffer and structured buffer context, but only ever one of the two, to avoid potential pitfalls around multiple possible layouts.`),
                dom.p({}, `Once we have figured out what is going on with the shader, we can spit out source language code that represents it. This should involve creating source language types for each HLSL type, ensuring to specify the offsets and sizes from HLSL. 
We should also spit out code that produces the root signature of the shader, which is pretty simple as we are only using 1 constant root parameter. We should also bind the DXIL somehow; this has many options like writing it out and then embedding it as a resource, or 
literally writing the bytes into the source, or packaging it as a build output to be loaded from file at runtime. We should also spit out pipeline state. For compute shaders, we can call CreateComputePipelineState which only requires the root signature and DXIL. 
Raytracing state is a bit more complex. First we ensure we create our root signature with the D3D12_ROOT_SIGNATURE_FLAG_LOCAL_ROOT_SIGNATURE flag, which marks it as a DXR shader signature (do not use D3D12_ROOT_SIGNATURE_FLAG_CBV_SRV_UAV_HEAP_DIRECTLY_INDEXED, this is for 
global signatures only). Secondly, we need to emit some D3D12_STATE_SUBOBJECTs. This should be one subobject which is a D3D12_STATE_SUBOBJECT_TYPE_DXIL_LIBRARY with our DXIL, one subobject which is a D3D12_STATE_SUBOBJECT_TYPE_LOCAL_ROOT_SIGNATURE with our local root 
signature, and one which is D3D12_STATE_SUBOBJECT_TYPE_SUBOBJECT_TO_EXPORTS_ASSOCIATION. This should associate our local root signature subobject to the entry point name. We can handle other subobjects separately as they are not per-shader. Finally, we should also export 
the shader entry point name, as we will need a list of these for the global signature and shader config association subobjects.`),
                dom.p({}, "This may all seem like a lot of effort, but it's well worth it compared to spending hours debugging only to find out you got the member offset wrong again."));
        }
    })
};
