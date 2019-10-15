// entity_manager.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Manages all the entities in the game

use crate::entity::{Entity, EntityId};

#[derive(Debug, Default)]
pub struct EntityManager {
    entities: Vec<Entity>,
}

impl EntityManager {
    pub fn create(&mut self) -> EntityId {
        let id = self.entities.len() as u64;
        let e = Entity { id };
        self.entities.push(e);

        id
    }

    pub fn get(&self, id: EntityId) -> &Entity {
        &self.entities[id as usize]
    }

    pub fn get_mut(&mut self, id: EntityId) -> &mut Entity {
        &mut self.entities[id as usize]
    }
}
