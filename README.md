# RUST TO TYPESCRIPT  

create ts interface define from rust struct (serde)


from rust

``` rust

#[derive(Serialize,Default)]
pub struct Connect<T> {
    index: usize,
    source: String,
    target: String,
    list: Vec<T>,
}
  

#[derive(Serialize)]
pub struct Cons2{
    pub source_ip: Vec<String>,
    pub count: u16,
}

```

to ts

``` typescript

export interface IConnect<T> {
    index: number;
    source: string;
    target: string;
    list: T[];
}

export interface ICons2 {
    source_ip: string[];
    count: number;
}


```

### install

`npm install rs2ts -g`


### usage

`rs2ts -i ../demo/common.rs -o ./target/cm.ts`

`rs2ts --help`