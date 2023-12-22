
import { createClient } from '@supabase/supabase-js'

/*
let js_runtime = "node";
export function utils_init(){
    if (Deno &&  Deno.env) {
        js_runtime="deno";
      }
    if( env && env.name ){
        js_runtime="cloudflare";
    } 
}

export function set_js_runtime(arg_js_runtime:string){
    js_runtime=arg_js_runtime;
}

*/
export function env_get(key: string): string | undefined {
    return process.env[key];
    /*
    if(js_runtime === "node" ){
        return process.env[key];
    }
    else if (js_runtime === "deno"){
        return Deno.env.get(key);
    }
    else if (js_runtime === "cloudflare"){
        return env[key];
    }
    */
}

export function env_set(key: string, value :string ) {
    return process.env[key] = value ;
}

const DATABASE_HOST="https://ubpnbnzpfmtbbrgigzjq.supabase.co";
const anonkey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicG5ibnpwZm10YmJyZ2lnempxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwNjQzODIsImV4cCI6MjAxNTY0MDM4Mn0.fS_FBY4mDgYVn1GDocKMuze5y_s_ZlX5acQ-QAVcvG0"
const supabase = await createClient(DATABASE_HOST, anonkey)

export function get_my_did(){
    return "did:pkh:eip155:1:"+env_get("my_private_key");
}

export async function self_mesh_node_register(){
    let cur_ip ;
    //@ts-ignore
        if( !env_get("my_endpoint")?.includes("localhost") ){
        const options = {method: 'GET', headers: {'Content-Type': 'application/json', "User-Agent": "curl/7.64.1"}};
        let res ;
          res = await (await  fetch('http://ipinfo.io/', options)).json();
          //@ts-ignore
            if(!res || res?.ip){
              
                res = await (await fetch('http://ifconfig.me/all.json', options)).json();
                //@ts-ignore
                if( res.ip_addr){
                        //@ts-ignore
                    res.ip = res.ip_addr;
                }
            }
         
            //@ts-ignore
        if(res && res.ip)
         cur_ip=res;
        
    }
    

    const { data, error } = await supabase
    .from('mesh_node_registry')
    .insert([
      { did : get_my_did(), endpoint: env_get("my_endpoint"), j:cur_ip },
    ])

}

export async function query_default_bootstrap_servers(){

    try{
    const { data, error } = await supabase
              
                .from('mesh_node_registry')
                .select()

    console.log("🚀 ~ file: utils.ts:86 ~ query_default_bootstrap_servers ~ data:", data)
    console.log("🚀 ~ file: utils.ts:85 ~ query_default_bootstrap_servers ~ error:", error)
    }catch(e){
    console.log("🚀 ~ file: utils.ts:90 ~ query_default_bootstrap_servers ~ e:", e)
    }

}
