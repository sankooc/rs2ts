# RUST TO TYPESCRIPT  

create ts interface define from rust struct (serde)


from rust

``` rust

#[derive(Serialize,Default)]
pub struct Cons{
    pub source_ip: String,
    pub count: u16,
    pub throughput: u32,
}
  

#[derive(Serialize)]
pub struct Cons2{
    pub source_ip: Vec<String>,
    pub count: u16,
}

```

to ts

``` typescript

export interface Cons {
    source_ip: string;
    count: number;
    throughput: number;
}
export interface Cons2 {
    source_ip: string[];
    count: number;
}


```

### install

`npm install rs2ts -g`


### usage

`rs2ts -i ../demo/common.rs -o ./target/cm.ts`

`rs2ts --help`