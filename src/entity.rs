// entity.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Entity (GameObject)

pub type EntityId = u64;

#[derive(Debug)]
pub struct Entity {
    pub id: EntityId,
}
