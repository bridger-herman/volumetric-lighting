// entity.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Entity (GameObject)

pub type EntityId = usize;

#[derive(Debug, Serialize, Deserialize)]
pub struct Entity {
    pub id: EntityId,
}
