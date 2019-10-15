//! Collection of traits common to the framework

/// Something that can be updated
pub trait Update {
    /// Perform update computations (every frame)
    fn update(&mut self);
}

/// Something that needs some setup
pub trait Setup {
    /// Called once at the beginning
    fn setup(&mut self);
}
