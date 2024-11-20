
delete global.window; // Ensure we mock the global window
global.window = { location: { href: '' } }; // Mock window.location

// Your function to test
function goToUserList() {
    window.location.href = '/users';
}

describe('Home Page Tests', () => {
    test('checks if View User List button redirects to /user-list.html', () => {
        window.location.href = '/user-list.html';
        expect(window.location.href).toBe('/user-list.html');
    });

    test('checks if Add User button redirects to /add-user.html', () => {
        window.location.href = '/add-user.html';
        expect(window.location.href).toBe('/add-user.html');
    });

    test('checks the goToUserList function redirection', () => {
        goToUserList();
        expect(window.location.href).toBe('/users');
    });
});
