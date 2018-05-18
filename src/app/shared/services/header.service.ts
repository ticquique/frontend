import { environment } from '../../../environments/environment';
import { InjectionToken, Inject, Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';

export interface FaviconsConfig {
    icons: IconsConfig;
    cacheBusting?: boolean;
}

export interface IconsConfig {
    [name: string]: IconConfig;
}

export interface IconConfig {
    type: string;
    href: string;
    isDefault?: boolean;
}

export abstract class Headers {
    abstract activateFavicon(name: string): void;
    abstract resetFavicon(): void;
    abstract setMeta(meta: MetaDefinition | MetaDefinition[]): void;
    abstract setTitle(name: string): void;
}

export const BROWSER_FAVICONS_CONFIG = new InjectionToken<FaviconsConfig>('Favicons Configuration');

@Injectable()
// tslint:disable-next-line:max-classes-per-file
export class HeaderService implements Headers {
    private faviconId: string;
    private icons: IconsConfig;
    private useCacheBusting: boolean;

    // I initialize the Favicons service.
    constructor(@Inject(BROWSER_FAVICONS_CONFIG) faviconConfig: FaviconsConfig, private meta: Meta, private title: Title) {
        this.setTitle(environment.app.name);
        this.setMeta(environment.app.meta);
        this.faviconId = 'favicons-service-injected-node';
        this.icons = Object.assign(Object.create(null), faviconConfig.icons);
        this.useCacheBusting = (faviconConfig.cacheBusting || false);
        this.removeExternalLinkElements();

    }

    public setTitle(name: string): void {
        this.title.setTitle(name);
    }
    // I create the metadata tags
    public setMeta(meta: MetaDefinition | MetaDefinition[]): void {
        if (meta instanceof Array) {
            meta.map(val => { this.meta.updateTag(val); });
        } else {
            this.meta.updateTag(meta);
        }
    }
    // I activate the favicon with the given name / identifier.
    public activateFavicon(name: string): void {
        if (!this.icons[name]) {
            throw (new Error(`Favicon for [ ${name} ] not found.`));
        }
        this.setNode(this.icons[name].type, this.icons[name].href);
    }

    // I activate the default favicon (with isDefault set to True).
    public resetFavicon(): void {
        for (const name of Object.keys(this.icons)) {
            const icon = this.icons[name];
            if (icon.isDefault) {
                this.setNode(icon.type, icon.href);
                return;
            }
        }
        this.removeNode();
    }

    private addNode(type: string, href: string): void {
        const linkElement = document.createElement('link');
        linkElement.setAttribute('id', this.faviconId);
        linkElement.setAttribute('rel', 'icon');
        linkElement.setAttribute('type', type);
        linkElement.setAttribute('href', href);
        document.head.appendChild(linkElement);
    }

    // I return an augmented HREF value with a cache-busting query-string parameter.
    private cacheBustHref(href: string): string {
        const augmentedHref = (href.indexOf('?') === -1)
            ? `${href}?faviconCacheBust=${Date.now()}`
            : `${href}&faviconCacheBust=${Date.now()}`
            ;
        return (augmentedHref);
    }

    // I remove any favicon nodes that are not controlled by this service.
    private removeExternalLinkElements(): void {
        const linkElements = document.querySelectorAll("link[ rel ~= 'icon' i]");
        for (const linkElement of Array.from(linkElements)) {
            linkElement.parentNode.removeChild(linkElement);
        }
    }

    // I remove the favicon node from the document header.
    private removeNode(): void {
        const linkElement = document.head.querySelector('#' + this.faviconId);
        if (linkElement) { document.head.removeChild(linkElement); }
    }

    // I remove the existing favicon node and inject a new favicon node with the given
    // element settings.
    private setNode(type: string, href: string): void {
        const augmentedHref = this.useCacheBusting
            ? this.cacheBustHref(href)
            : href
            ;
        this.removeNode();
        this.addNode(type, augmentedHref);
    }
}
