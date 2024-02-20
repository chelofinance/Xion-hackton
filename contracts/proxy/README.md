# Proxy For Multisig

## Running this contract

You will need Rust 1.44.1+ with `wasm32-unknown-unknown` target installed.

You can run unit tests on this via: 

`cargo test`

Once you are happy with the content, you can compile it to wasm via:

```shell
RUSTFLAGS='-C link-arg=-s' cargo wasm
cp ../../target/wasm32-unknown-unknown/release/proxy.wasm ./proxy.wasm
ls -l proxy.wasm
sha256sum proxy.wasm
```

Or for a production-ready (optimized) build, run a build command in the
repository root: https://github.com/CosmWasm/cw-plus#compiling.
