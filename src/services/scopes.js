const adminScopes = [
  'signin:auth',
  'signup:auth',
  'read:users',
  //'create:users',
  'update:users',
  'delete:users',
  'read:seniorities',
  'create:seniorities',
  'update:seniorities',
  'delete:seniorities',
  'read:teams',
  'create:teams',
  'update:teams',
  'delete:teams',
];

const publicScopes = ['signin:auth'];

class ScopeKeys {
  scope(user) {
    if (user.isAdmin) {
      return adminScopes;
    } else {
      return publicScopes;
    }
  }
}
module.exports = ScopeKeys;
