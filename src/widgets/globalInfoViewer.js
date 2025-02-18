/* exported FlatsealGlobalInfoViewer */
/* eslint accessor-pairs: */

/* globalInfoViewer.js
 *
 * Copyright 2022 Martin Abente Lahaye
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const { GObject, Gtk } = imports.gi;

const _propFlags = GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT;
const { info, permissions, portals } = imports.models;

const styles = {
    NORMAL: 'normal',
    COMPACT: 'compact',
};

var FlatsealGlobalInfoViewer = GObject.registerClass({
    GTypeName: 'FlatsealGlobalInfoViewer',
    Template: 'resource:///com/github/tchx84/Flatseal/widgets/globalInfoViewer.ui',
    InternalChildren: ['icon', 'title', 'description', 'flatpak', 'portal', 'overrides'],
    Properties: {
        compact: GObject.ParamSpec.boolean(
            'compact',
            'compact',
            'compact',
            _propFlags, false),
    },
}, class FlatsealGlobalInfoViewer extends Gtk.Box {
    _init() {
        super._init();
        this._compact = false;
        this._setup();
    }

    _setup() {
        this.constructor._setIfAvailable(this._flatpak, info.getDefault().getVersion());
        this.constructor._setIfAvailable(this._portal, portals.getDefault().getVersion());
        this.constructor._setIfAvailable(this._overrides, permissions.getDefault()._getBaseOverridesPath());
    }

    static _setIfAvailable(label, value) {
        if (!value)
            return;
        label.set_label(value.toString());
    }

    set compact(value) {
        if (typeof this._icon === 'undefined')
            return;
        if (this._compact === value)
            return;

        const orientation = value ? Gtk.Orientation.VERTICAL : Gtk.Orientation.HORIZONTAL;
        const alignment = value ? Gtk.Align.CENTER : Gtk.Align.START;

        this.set_orientation(orientation);
        this._icon.halign = alignment;
        this._title.halign = alignment;
        this._description.halign = alignment;
        this.halign = alignment;

        const style = value ? styles.COMPACT : styles.NORMAL;
        const context = this.get_style_context();

        if (context.has_class(styles.NORMAL))
            context.remove_class(styles.NORMAL);
        if (context.has_class(styles.COMPACT))
            context.remove_class(styles.COMPACT);

        context.add_class(style);

        this._compact = value;
    }
});
